import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { toast } from "sonner";
import { createShape } from "./shapes/ShapeFactory";
import { ColorPicker } from "./canvas/ColorPicker";
import { CanvasTools } from "./canvas/CanvasTools";
import { HintShapes } from "./shapes/HintShapes";
import { ShapeControls } from "./shapes/ShapeControls";

interface DrawingCanvasProps {
  onFinishDrawing: () => void;
  currentWord: string;
}

const SYNC_INTERVAL = 100;

export const DrawingCanvas = ({ onFinishDrawing, currentWord }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const syncIntervalRef = useRef<number>();
  const lastSyncRef = useRef<string>("");

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = currentColor;
    
    const roomId = new URLSearchParams(window.location.search).get("room");
    if (roomId) {
      const roomData = JSON.parse(sessionStorage.getItem(roomId) || "{}");
      if (roomData.canvasData) {
        canvas.loadFromJSON(roomData.canvasData, () => {
          canvas.renderAll();
          console.log("Canvas loaded from storage");
        });
      }
    }

    canvas.on('path:created', () => broadcastDrawing(canvas));
    canvas.on('object:modified', () => broadcastDrawing(canvas));

    setFabricCanvas(canvas);

    syncIntervalRef.current = window.setInterval(() => {
      if (canvas) {
        const roomId = new URLSearchParams(window.location.search).get("room");
        if (roomId) {
          const roomData = JSON.parse(sessionStorage.getItem(roomId) || "{}");
          if (roomData.canvasData && roomData.canvasData !== lastSyncRef.current) {
            canvas.loadFromJSON(roomData.canvasData, () => {
              canvas.renderAll();
              console.log("Canvas synced from storage");
            });
            lastSyncRef.current = roomData.canvasData;
          }
        }
      }
    }, SYNC_INTERVAL);

    return () => {
      canvas.dispose();
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

  const broadcastDrawing = (canvas: FabricCanvas) => {
    const roomId = new URLSearchParams(window.location.search).get("room");
    if (!roomId) return;

    const canvasData = JSON.stringify(canvas.toJSON());
    if (canvasData === lastSyncRef.current) return;

    const roomData = JSON.parse(sessionStorage.getItem(roomId) || "{}");
    roomData.canvasData = canvasData;
    sessionStorage.setItem(roomId, JSON.stringify(roomData));
    lastSyncRef.current = canvasData;
    console.log("Canvas broadcasted to storage");
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
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="border-4 border-primary/20 rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-2xl transform hover:-translate-y-1">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-lg border-2 border-primary/20">
        <ColorPicker currentColor={currentColor} onColorChange={handleColorChange} />
        <div className="flex gap-4 items-center">
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