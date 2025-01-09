import { Button } from "@/components/ui/button";
import { Square, Circle, Triangle } from "lucide-react";
import { toast } from "sonner";

interface HintShapesProps {
  word: string;
  onAddShape: (shapeType: 'rectangle' | 'circle' | 'triangle', size?: { width?: number; height?: number; radius?: number }, position?: { x?: number, y?: number }) => void;
}

const SHAPE_HINTS: Record<string, Array<{ 
  shapes: Array<{
    type: 'rectangle' | 'circle' | 'triangle';
    size: { width?: number; height?: number; radius?: number };
    position: { x: number, y: number };
  }>,
  label: string 
}>> = {
  pizza: [
    {
      label: 'Pizza Base',
      shapes: [
        { type: 'circle', size: { radius: 100 }, position: { x: 0, y: 0 } },
        { type: 'circle', size: { radius: 90 }, position: { x: 0, y: 0 } },
        { type: 'triangle', size: { width: 80, height: 100 }, position: { x: 40, y: 0 } },
      ]
    }
  ],
  computer: [
    {
      label: 'Monitor',
      shapes: [
        { type: 'rectangle', size: { width: 150, height: 100 }, position: { x: 0, y: 0 } },
        { type: 'rectangle', size: { width: 140, height: 90 }, position: { x: 5, y: 5 } },
        { type: 'rectangle', size: { width: 50, height: 20 }, position: { x: 50, y: 100 } },
      ]
    }
  ],
  elephant: [
    {
      label: 'Elephant Head',
      shapes: [
        { type: 'circle', size: { radius: 60 }, position: { x: 0, y: 0 } },
        { type: 'rectangle', size: { width: 40, height: 100 }, position: { x: 60, y: 30 } },
        { type: 'circle', size: { radius: 20 }, position: { x: 90, y: 130 } },
      ]
    }
  ],
  butterfly: [
    {
      label: 'Wing Pattern',
      shapes: [
        { type: 'circle', size: { radius: 40 }, position: { x: -50, y: 0 } },
        { type: 'circle', size: { radius: 40 }, position: { x: 50, y: 0 } },
        { type: 'rectangle', size: { width: 10, height: 80 }, position: { x: 0, y: 0 } },
      ]
    }
  ],
  beach: [
    {
      label: 'Beach Scene',
      shapes: [
        { type: 'circle', size: { radius: 40 }, position: { x: 40, y: -40 } },
        { type: 'triangle', size: { width: 200, height: 50 }, position: { x: 0, y: 50 } },
        { type: 'triangle', size: { width: 200, height: 30 }, position: { x: 20, y: 40 } },
      ]
    }
  ]
};

export const HintShapes = ({ word, onAddShape }: HintShapesProps) => {
  const hints = SHAPE_HINTS[word.toLowerCase()] || [];

  if (hints.length === 0) {
    return null;
  }

  const handleAddShapeGroup = (hint: typeof hints[0]) => {
    hint.shapes.forEach(shape => {
      onAddShape(shape.type, shape.size, shape.position);
    });
    toast(`Added ${hint.label} shapes for ${word}`);
  };

  return (
    <div className="flex gap-2">
      {hints.map((hint, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => handleAddShapeGroup(hint)}
          title={`Add ${hint.label}`}
        >
          {hint.label}
        </Button>
      ))}
    </div>
  );
};