import { Button } from "@/components/ui/button";
import { Eraser, Paintbrush, Undo2, X } from "lucide-react";

interface CanvasToolsProps {
  isEraser: boolean;
  onToggleEraser: () => void;
  onUndo: () => void;
  onClear: () => void;
  onFinishDrawing: () => void;
}

export const CanvasTools = ({
  isEraser,
  onToggleEraser,
  onUndo,
  onClear,
  onFinishDrawing
}: CanvasToolsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleEraser}
        className={isEraser ? "bg-primary text-white" : ""}
      >
        {isEraser ? <Eraser /> : <Paintbrush />}
      </Button>
      <Button variant="outline" size="icon" onClick={onUndo}>
        <Undo2 />
      </Button>
      <Button variant="outline" size="icon" onClick={onClear}>
        <X />
      </Button>
      <Button onClick={onFinishDrawing}>Finish Drawing</Button>
    </div>
  );
};