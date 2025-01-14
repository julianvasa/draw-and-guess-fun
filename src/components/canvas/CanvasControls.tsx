import { Canvas } from "fabric";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";
import { Slider } from "@/components/ui/slider";

interface CanvasControlsProps {
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

export const CanvasControls = ({
  fabricCanvas,
  currentColor,
  currentOpacity,
  isEraser,
  onColorChange,
  onOpacityChange,
  onEraserToggle,
  onFinishDrawing,
  broadcastDrawing
}: CanvasControlsProps) => {
  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    broadcastDrawing();
  };

  const handleOpacityChange = (value: number[]) => {
    onOpacityChange(value[0]);
    if (fabricCanvas?.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.opacity = value[0];
    }
  };

  const toggleEraser = () => {
    const newIsEraser = !isEraser;
    onEraserToggle(newIsEraser);
    
    if (!fabricCanvas?.freeDrawingBrush) return;
    
    if (newIsEraser) {
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
      fabricCanvas.freeDrawingBrush.width = 20;
    } else {
      fabricCanvas.freeDrawingBrush.color = currentColor;
      fabricCanvas.freeDrawingBrush.width = 5;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 w-full rounded-lg border shadow-sm">
      <ColorPicker currentColor={currentColor} onColorChange={onColorChange} />
      
      <div className="flex items-center gap-4">
        <Button
          variant={isEraser ? "secondary" : "outline"}
          size="icon"
          onClick={toggleEraser}
          className="w-10 h-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M20 20H7L3 16c-1.5-1.5-1.5-3.5 0-5l7-7c1.5-1.5 3.5-1.5 5 0l5 5c1.5 1.5 1.5 3.5 0 5l-4 4" />
          </svg>
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={handleClear}
          className="w-10 h-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </Button>
      </div>

      <div className="flex items-center gap-2 min-w-[200px]">
        <span className="text-sm font-medium">Opacity:</span>
        <Slider
          value={[currentOpacity]}
          onValueChange={handleOpacityChange}
          min={0.1}
          max={1}
          step={0.1}
          className="w-32"
        />
      </div>

      <div className="ml-auto">
        <Button onClick={onFinishDrawing} variant="default">
          I'm Done!
        </Button>
      </div>
    </div>
  );
};