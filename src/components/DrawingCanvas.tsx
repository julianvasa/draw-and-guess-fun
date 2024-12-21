import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eraser, Paintbrush, Undo2, X } from "lucide-react";

interface DrawingCanvasProps {
  onFinishDrawing: () => void;
}

export const DrawingCanvas = ({ onFinishDrawing }: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [isEraser, setIsEraser] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 600,
      height: 400,
      backgroundColor: "#ffffff",
      isDrawingMode: true,
    });

    canvas.freeDrawingBrush.width = 5;
    canvas.freeDrawingBrush.color = "#000000";
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  const toggleEraser = () => {
    if (!fabricCanvas) return;
    setIsEraser(!isEraser);
    fabricCanvas.freeDrawingBrush.color = isEraser ? "#000000" : "#ffffff";
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

  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in">
      <div className="border-2 border-canvas-border rounded-lg shadow-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
      <div className="flex gap-2">
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