import { Button } from "@/components/ui/button";
import { Square, Circle as CircleIcon, Triangle as TriangleIcon } from "lucide-react";

interface ShapeControlsProps {
  onAddShape: (shapeType: 'rectangle' | 'circle' | 'triangle') => void;
}

export const ShapeControls = ({ onAddShape }: ShapeControlsProps) => {
  return (
    <div className="flex gap-2 mr-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onAddShape('rectangle')}
        title="Add Rectangle"
      >
        <Square className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onAddShape('circle')}
        title="Add Circle"
      >
        <CircleIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onAddShape('triangle')}
        title="Add Triangle"
      >
        <TriangleIcon className="h-4 w-4" />
      </Button>
    </div>
  );
};