import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eraser, Paintbrush, Undo2, X } from "lucide-react";

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

export const DrawingCanvas = ({ onFinishDrawing }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [currentColor, setCurrentColor] = useState(COLORS.black);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    // Initialize the brush first
    canvas.freeDrawingBrush = new PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = currentColor;
    
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const toggleEraser = () => {
    if (!fabricCanvas) return;
    setIsEraser(!isEraser);
    fabricCanvas.freeDrawingBrush.color = !isEraser ? "#ffffff" : currentColor;
    toast(isEraser ? "Switched to pen" : "Switched to eraser");
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    toast("Canvas cleared!");
  };

  const undoLastStroke = () => {
    if (!fabricCanvas) return;
    const objects = fabricCanvas.getObjects();
    if (objects.length > 0) {
      fabricCanvas.remove(objects[objects.length - 1]);
      toast("Undid last stroke");
    }
  };

  const handleColorChange = (color: string) => {
    if (!fabricCanvas) return;
    setCurrentColor(color);
    if (!isEraser) {
      fabricCanvas.freeDrawingBrush.color = color;
      toast(`Color changed to ${Object.keys(COLORS).find(key => COLORS[key as keyof typeof COLORS] === color) || 'selected color'}`);
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