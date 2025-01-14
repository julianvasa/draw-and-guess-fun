import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { toast } from "sonner";
import { createShape } from "./shapes/ShapeFactory";
import { ColorPicker } from "./canvas/ColorPicker";
import { CanvasTools } from "./canvas/CanvasTools";
import { HintShapes } from "./shapes/HintShapes";
import { ShapeControls } from "./shapes/ShapeControls";
import { supabase, Room } from "@/lib/supabase";

interface DrawingCanvasProps {
  onFinishDrawing: () => void;
  currentWord: string;
}

const SYNC_INTERVAL = 100;

export const DrawingCanvas = ({ onFinishDrawing, currentWord }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentOpacity, setCurrentOpacity] = useState(1);
  const syncIntervalRef = useRef<number>();
  const lastSyncRef = useRef<string>("");

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = Math.min(600, window.innerHeight * 0.6);

    const canvas = new FabricCanvas(canvasRef.current, {
      width: containerWidth,
      height: containerHeight,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = currentColor;
    
    const roomId = new URLSearchParams(window.location.search).get("room");
    if (roomId) {
      supabase
        .from('rooms')
        .select<'*', Room>('*')
        .eq('id', roomId)
        .single()
        .then(({ data }) => {
          if (data?.canvas_data) {
            canvas.loadFromJSON(data.canvas_data, () => {
              canvas.renderAll();
              console.log("Canvas loaded from Supabase");
            });
          }
        });

      const channel = supabase.channel(`canvas:${roomId}`);
      
      channel
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence sync for canvas');
        })
        .on('broadcast', { event: 'canvas_update' }, (payload: { new: Room }) => {
          if (payload.new && payload.new.canvas_data !== lastSyncRef.current) {
            canvas.loadFromJSON(payload.new.canvas_data, () => {
              canvas.renderAll();
              console.log("Canvas synced from Supabase");
            });
            lastSyncRef.current = payload.new.canvas_data;
          }
        })
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }

    canvas.on('path:created', () => broadcastDrawing(canvas));
    canvas.on('object:modified', () => broadcastDrawing(canvas));

    setFabricCanvas(canvas);

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = Math.min(600, window.innerHeight * 0.6);
      canvas.setDimensions({ width: newWidth, height: newHeight });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      canvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const broadcastDrawing = async (canvas: FabricCanvas) => {
    const roomId = new URLSearchParams(window.location.search).get("room");
    if (!roomId) return;

    const canvasData = canvas.toJSON();
    if (JSON.stringify(canvasData) === lastSyncRef.current) return;

    await supabase
      .from('rooms')
      .update({ canvas_data: canvasData })
      .eq('id', roomId);

    lastSyncRef.current = JSON.stringify(canvasData);
    console.log("Canvas broadcasted to Supabase");
  };

  const addShape = (
    shapeType: 'rectangle' | 'circle' | 'triangle', 
    size?: { width?: number; height?: number; radius?: number },
    position?: { x?: number, y?: number }
  ) => {
    if (!fabricCanvas) return;

    const center = fabricCanvas.getCenter();
    const shape = createShape(shapeType, {
      left: center.left + (position?.x || 0),
      top: center.top + (position?.y || 0),
      fill: currentColor,
      opacity: currentOpacity,
      ...size,
    });

    fabricCanvas.isDrawingMode = false;
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.renderAll();
    broadcastDrawing(fabricCanvas);
  };

  const toggleEraser = () => {
    if (!fabricCanvas) return;
    setIsEraser(!isEraser);
    fabricCanvas.freeDrawingBrush.color = !isEraser ? "#ffffff" : currentColor;
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    broadcastDrawing(fabricCanvas);
    toast("Canvas cleared!");
  };

  const undoLastStroke = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      broadcastDrawing(fabricCanvas);
      toast("Undid last stroke");
    }
  };

  const handleColorChange = (color: string) => {
    if (!fabricCanvas) return;
    setCurrentColor(color);
    if (!isEraser) {
      fabricCanvas.freeDrawingBrush.color = color;
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in w-full max-w-[95vw] lg:max-w-[80vw] mx-auto">
      <div ref={containerRef} className="border-4 border-primary/20 rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-2xl transform hover:-translate-y-1 w-full">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex flex-wrap justify-center gap-4 items-center bg-white p-4 rounded-2xl shadow-lg border-2 border-primary/20 w-full">
        <ColorPicker currentColor={currentColor} onColorChange={handleColorChange} />
        <div className="flex items-center gap-2">
          <label htmlFor="opacity" className="text-sm font-medium">
            Opacity:
          </label>
          <input
            id="opacity"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={currentOpacity}
            onChange={(e) => setCurrentOpacity(parseFloat(e.target.value))}
            className="w-24"
          />
        </div>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <ShapeControls onAddShape={addShape} />
          <HintShapes word={currentWord} onAddShape={addShape} />
        </div>
        <CanvasTools
          isEraser={isEraser}
          onToggleEraser={toggleEraser}
          onUndo={undoLastStroke}
          onClear={clearCanvas}
          onFinishDrawing={onFinishDrawing}
        />
      </div>
    </div>
  );
};
