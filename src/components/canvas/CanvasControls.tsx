import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CanvasControlsProps } from "@/types";
import { ColorPicker } from "./ColorPicker";

export const CanvasControls = ({
  fabricCanvas,
  currentColor,
  currentOpacity,
  isEraser,
  currentWord,
  onColorChange,
  onOpacityChange,
  onEraserToggle,
  onFinishDrawing,
  broadcastDrawing,
}: CanvasControlsProps) => {
  const handleOpacityChange = (values: number[]) => {
    if (!fabricCanvas) return;
    const opacity = values[0];
    onOpacityChange(opacity);
    if (fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = `rgba(${parseInt(currentColor.slice(1, 3), 16)}, ${parseInt(currentColor.slice(3, 5), 16)}, ${parseInt(currentColor.slice(5, 7), 16)}, ${opacity})`;
    }
  };

  const toggleEraser = () => {
    if (!fabricCanvas) return;
    const newIsEraser = !isEraser;
    onEraserToggle(newIsEraser);
    if (newIsEraser) {
      fabricCanvas.freeDrawingBrush.color = "#ffffff";
    } else {
      fabricCanvas.freeDrawingBrush.color = currentColor;
    }
  };

  const handleColorChange = (color: string) => {
    if (!fabricCanvas) return;
    onColorChange(color);
    if (!isEraser && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = color;
    }
  };

  const handleFinishDrawing = () => {
    if (broadcastDrawing) {
      broadcastDrawing();
    }
    onFinishDrawing();
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 w-full rounded-lg border shadow-sm">
      <ColorPicker color={currentColor} onChange={handleColorChange} />
      
      <div className="w-48">
        <Slider
          value={[currentOpacity]}
          onValueChange={handleOpacityChange}
          min={0}
          max={1}
          step={0.1}
          className="w-full"
        />
      </div>

      <Button
        variant={isEraser ? "secondary" : "outline"}
        onClick={toggleEraser}
        className="w-24"
      >
        {isEraser ? "Drawing" : "Eraser"}
      </Button>

      <Button onClick={handleFinishDrawing} variant="default">
        I'm Done!
      </Button>
    </div>
  );
};