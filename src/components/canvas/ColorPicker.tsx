import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({ color, onChange }: ColorPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[65px] h-[35px] p-1"
        >
          <div
            className="w-full h-full rounded"
            style={{ backgroundColor: color }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px]">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => onChange(e.target.value)}
            />
            <Input
              value={color}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[
              "#000000",
              "#FF0000",
              "#00FF00",
              "#0000FF",
              "#FFFF00",
              "#FF00FF",
              "#00FFFF",
              "#808080",
              "#800000",
              "#808000",
            ].map((presetColor) => (
              <Button
                key={presetColor}
                variant="outline"
                className="w-full p-1 h-8"
                onClick={() => onChange(presetColor)}
              >
                <div
                  className="w-full h-full rounded"
                  style={{ backgroundColor: presetColor }}
                />
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};