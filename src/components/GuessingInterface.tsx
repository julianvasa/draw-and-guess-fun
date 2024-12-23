import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GuessingInterfaceProps {
  guess: string;
  onGuessChange: (value: string) => void;
  onGuessSubmit: () => void;
}

export const GuessingInterface = ({ guess, onGuessChange, onGuessSubmit }: GuessingInterfaceProps) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">Guess the drawing!</h2>
      <div className="flex gap-2 w-full max-w-md">
        <Input
          value={guess}
          onChange={(e) => onGuessChange(e.target.value)}
          placeholder="Type your guess here..."
          onKeyDown={(e) => e.key === "Enter" && onGuessSubmit()}
        />
        <Button onClick={onGuessSubmit}>Guess</Button>
      </div>
    </div>
  );
};