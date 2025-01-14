import { Button } from "@/components/ui/button";

interface ColorPickerProps {
  currentColor: string;
  onColorChange: (color: string) => void;
}

const COLORS = {
  black: "#000000",
  red: "#FF0000",
  orange: "#FF7F00",
  yellow: "#FFFF00",
  green: "#00FF00",
  blue: "#0000FF",
  indigo: "#4B0082",
  violet: "#8F00FF"
};

export const ColorPicker = ({ currentColor, onColorChange }: ColorPickerProps) => {
  return (
    <div className="flex gap-2 mr-4">
      {Object.entries(COLORS).map(([name, color]) => (
        <button
          key={name}
          className={`w-8 h-8 rounded-full border-2 ${
            currentColor === color ? 'border-primary' : 'border-gray-200'
          } transition-all hover:scale-110`}
          style={{ backgroundColor: color }}
          onClick={() => onColorChange(color)}
          title={name.charAt(0).toUpperCase() + name.slice(1)}
        />
      ))}
    </div>
  );
};