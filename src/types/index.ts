import { Canvas } from "fabric";

export interface DrawingCanvasProps {
  onFinishDrawing: () => void;
  currentWord: string;
}

export interface CanvasControlsProps {
  fabricCanvas: Canvas | null;
  currentColor: string;
  currentOpacity: number;
  isEraser: boolean;
  currentWord: string;
  onColorChange: (color: string) => void;
  onOpacityChange: (opacity: number) => void;
  onEraserToggle: (isEraser: boolean) => void;
  onFinishDrawing: () => void;
  broadcastDrawing: () => void;
}