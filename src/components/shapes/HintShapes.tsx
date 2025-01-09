import { Button } from "@/components/ui/button";
import { Square, Circle, Triangle } from "lucide-react";
import { toast } from "sonner";

interface HintShapesProps {
  word: string;
  onAddShape: (shapeType: 'rectangle' | 'circle' | 'triangle', size?: { width?: number; height?: number; radius?: number }) => void;
}

const SHAPE_HINTS: Record<string, Array<{ type: 'rectangle' | 'circle' | 'triangle'; label: string; size?: { width?: number; height?: number; radius?: number } }>> = {
  pizza: [
    { type: 'circle', label: 'Base', size: { radius: 100 } },
    { type: 'triangle', label: 'Slice', size: { width: 80, height: 100 } },
  ],
  computer: [
    { type: 'rectangle', label: 'Screen', size: { width: 150, height: 100 } },
    { type: 'rectangle', label: 'Keyboard', size: { width: 180, height: 60 } },
  ],
  elephant: [
    { type: 'circle', label: 'Body', size: { radius: 80 } },
    { type: 'rectangle', label: 'Trunk', size: { width: 40, height: 100 } },
  ],
  butterfly: [
    { type: 'circle', label: 'Body', size: { radius: 30 } },
    { type: 'circle', label: 'Wing', size: { radius: 60 } },
  ],
  beach: [
    { type: 'circle', label: 'Sun', size: { radius: 40 } },
    { type: 'triangle', label: 'Wave', size: { width: 100, height: 50 } },
  ],
  bicycle: [
    { type: 'circle', label: 'Wheel', size: { radius: 50 } },
    { type: 'rectangle', label: 'Frame', size: { width: 120, height: 20 } },
  ],
  guitar: [
    { type: 'rectangle', label: 'Body', size: { width: 120, height: 180 } },
    { type: 'rectangle', label: 'Neck', size: { width: 30, height: 200 } },
  ],
  penguin: [
    { type: 'circle', label: 'Body', size: { radius: 60 } },
    { type: 'circle', label: 'Head', size: { radius: 40 } },
  ],
  rocket: [
    { type: 'rectangle', label: 'Body', size: { width: 60, height: 150 } },
    { type: 'triangle', label: 'Tip', size: { width: 60, height: 80 } },
  ],
  rainbow: [
    { type: 'circle', label: 'Arc', size: { radius: 100 } },
    { type: 'circle', label: 'Small Arc', size: { radius: 80 } },
  ],
};

export const HintShapes = ({ word, onAddShape }: HintShapesProps) => {
  const shapes = SHAPE_HINTS[word.toLowerCase()] || [];

  if (shapes.length === 0) {
    return null;
  }

  const getIcon = (type: 'rectangle' | 'circle' | 'triangle') => {
    switch (type) {
      case 'rectangle':
        return <Square className="h-4 w-4" />;
      case 'circle':
        return <Circle className="h-4 w-4" />;
      case 'triangle':
        return <Triangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex gap-2">
      {shapes.map((shape, index) => (
        <Button
          key={index}
          variant="outline"
          size="icon"
          onClick={() => {
            onAddShape(shape.type, shape.size);
            toast(`Added ${shape.label} shape for ${word}`);
          }}
          title={`Add ${shape.label}`}
        >
          {getIcon(shape.type)}
        </Button>
      ))}
    </div>
  );
};