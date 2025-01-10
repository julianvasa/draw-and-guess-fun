import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GuessingInterfaceProps {
  guess: string;
  onGuessChange: (value: string) => void;
  onGuessSubmit: () => void;
}

export const GuessingInterface = ({ guess, onGuessChange, onGuessSubmit }: GuessingInterfaceProps) => {
  return (
    <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-2xl shadow-lg animate-fade-in border-2 border-primary/20">
      <h2 className="text-2xl font-bold text-game-text animate-bounce-light">
        Guess the drawing!
      </h2>
      <div className="flex gap-3 w-full max-w-md">
        <Input
          value={guess}
          onChange={(e) => onGuessChange(e.target.value)}
          placeholder="Type your guess here..."
          onKeyDown={(e) => e.key === "Enter" && onGuessSubmit()}
          className="text-lg py-6 px-6 rounded-xl border-2 border-primary/20"
        />
        <Button 
          onClick={onGuessSubmit}
          className="px-8 rounded-xl transform transition-all duration-200 hover:scale-105"
        >
          Guess!
        </Button>
      </div>
    </div>
  );
};