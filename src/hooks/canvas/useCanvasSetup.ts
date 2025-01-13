import { RefObject } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";

interface UseCanvasSetupProps {
  canvasRef: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLDivElement>;
  currentColor: string;
  setFabricCanvas: (canvas: FabricCanvas) => void;
}

export const useCanvasSetup = ({ 
  canvasRef, 
  containerRef, 
  currentColor, 
  setFabricCanvas 
}: UseCanvasSetupProps) => {
  const initializeCanvas = () => {
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

    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = Math.min(600, window.innerHeight * 0.6);
      canvas.setDimensions({ width: newWidth, height: newHeight });
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
      window.removeEventListener('resize', handleResize);
    };
  };

  return { initializeCanvas };
};