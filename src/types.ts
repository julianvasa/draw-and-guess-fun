import { Canvas } from "fabric";

export interface DrawingCanvasProps {
  onFinishDrawing: () => void;
  currentWord: string;
}

// Add proper typing for the FabricJS brush
declare module 'fabric' {
  interface BaseBrush {
    opacity: number;
    color: string;
    width: number;
  }
}