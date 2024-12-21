import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

interface WordPromptProps {
  word: string;
  onNewWord: () => void;
}

export const WordPrompt = ({ word, onNewWord }: WordPromptProps) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow animate-fade-in">
      <h2 className="text-xl font-semibold text-game-text">Draw: {word}</h2>
      <Button variant="ghost" size="icon" onClick={onNewWord}>
        <Shuffle className="h-4 w-4" />
      </Button>
    </div>
  );
};