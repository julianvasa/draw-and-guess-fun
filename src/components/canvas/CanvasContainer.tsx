import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useCanvasSetup } from "@/hooks/canvas/useCanvasSetup";
import { useCanvasSync } from "@/hooks/canvas/useCanvasSync";
import { CanvasControls } from "./CanvasControls";

interface CanvasContainerProps {
  onFinishDrawing: () => void;
  currentWord: string;
}

export const CanvasContainer = ({ onFinishDrawing, currentWord }: CanvasContainerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [currentOpacity, setCurrentOpacity] = useState(1);
  const [isEraser, setIsEraser] = useState(false);

  const { initializeCanvas } = useCanvasSetup({ 
    canvasRef, 
    containerRef, 
    currentColor, 
    setFabricCanvas 
  });

  const { broadcastDrawing } = useCanvasSync({ fabricCanvas });

  useEffect(() => {
    initializeCanvas();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in w-full max-w-[95vw] lg:max-w-[80vw] mx-auto">
      <div ref={containerRef} className="border-4 border-primary/20 rounded-2xl shadow-xl overflow-hidden transition-transform duration-300 hover:shadow-2xl transform hover:-translate-y-1 w-full">
        <canvas ref={canvasRef} />
      </div>
      <CanvasControls
        fabricCanvas={fabricCanvas}
        currentColor={currentColor}
        currentOpacity={currentOpacity}
        isEraser={isEraser}
        currentWord={currentWord}
        onColorChange={setCurrentColor}
        onOpacityChange={setCurrentOpacity}
        onEraserToggle={setIsEraser}
        onFinishDrawing={onFinishDrawing}
        broadcastDrawing={broadcastDrawing}
      />
    </div>
  );
};