import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eraser, Paintbrush, Undo2, X } from "lucide-react";
import { ShapeControls } from "./shapes/ShapeControls";
import { createShape } from "./shapes/ShapeFactory";

interface DrawingCanvasProps {
  onFinishDrawing: () => void;
}

const COLORS = {
  black: "#000000",
  red: "#FF0000",
  orange: "#FF7F00",
  yellow: "#FFFF00",
  green: "#00FF00",
  blue: "#0000FF",
  indigo: "#4B0082",
  violet: "#8F00FF"
};

const SYNC_INTERVAL = 100;

export const DrawingCanvas = ({ onFinishDrawing }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [currentColor, setCurrentColor] = useState(COLORS.black);
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
    
    // Load existing drawing if available
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

    // Set up event listener for drawing updates
    canvas.on('path:created', () => {
      broadcastDrawing(canvas);
    });

    // Set up event listener for object modifications
    canvas.on('object:modified', () => {
      broadcastDrawing(canvas);
    });

    setFabricCanvas(canvas);

    // Set up sync interval
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

  const addShape = (shapeType: 'rectangle' | 'circle' | 'triangle') => {
    if (!fabricCanvas) return;

    const center = fabricCanvas.getCenter();
    const shape = createShape(shapeType, {
      left: center.left,
      top: center.top,
      fill: currentColor,
    });

    fabricCanvas.isDrawingMode = false; // Disable drawing mode to allow shape manipulation
    fabricCanvas.add(shape);
    fabricCanvas.setActiveObject(shape);
    fabricCanvas.renderAll();
    broadcastDrawing(fabricCanvas);
    toast(`Added ${shapeType}! You can now move it around.`);
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
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="border-2 border-canvas-border rounded-lg shadow-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex gap-2 mr-4">
          {Object.entries(COLORS).map(([name, color]) => (
            <button
              key={name}
              className={`w-8 h-8 rounded-full border-2 ${
                currentColor === color ? 'border-primary' : 'border-gray-200'
              } transition-all hover:scale-110`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
              title={name.charAt(0).toUpperCase() + name.slice(1)}
            />
          ))}
        </div>
        <ShapeControls onAddShape={addShape} />
        <Button
          variant="outline"
          size="icon"
          onClick={toggleEraser}
          className={isEraser ? "bg-primary text-white" : ""}
        >
          {isEraser ? <Eraser /> : <Paintbrush />}
        </Button>
        <Button variant="outline" size="icon" onClick={undoLastStroke}>
          <Undo2 />
        </Button>
        <Button variant="outline" size="icon" onClick={clearCanvas}>
          <X />
        </Button>
        <Button onClick={onFinishDrawing}>Finish Drawing</Button>
      </div>
    </div>
  );
};
