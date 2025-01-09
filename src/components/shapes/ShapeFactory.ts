import { Rect, Circle, Triangle } from "fabric";

interface ShapeOptions {
  left: number;
  top: number;
  fill: string;
  width?: number;
  height?: number;
  radius?: number;
}

export const createShape = (
  shapeType: 'rectangle' | 'circle' | 'triangle',
  options: ShapeOptions
) => {
  const commonProps = {
    left: options.left,
    top: options.top,
    fill: options.fill,
    originX: 'center' as const,
    originY: 'center' as const,
    selectable: true,
    hasControls: true,
  };

  switch (shapeType) {
    case 'rectangle':
      return new Rect({
        ...commonProps,
        width: options.width || 100,
        height: options.height || 60,
      });
    case 'circle':
      return new Circle({
        ...commonProps,
        radius: options.radius || 30,
      });
    case 'triangle':
      return new Triangle({
        ...commonProps,
        width: options.width || 100,
        height: options.height || 100,
      });
  }
};