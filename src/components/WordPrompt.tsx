import { Button } from "@/components/ui/button";
import { useState } from "react";

interface WordPromptProps {
  word: string;
  onNewWord: () => void;
  wordOptions?: string[];
  onWordSelect?: (word: string) => void;
}

export const WordPrompt = ({ word, onNewWord, wordOptions, onWordSelect }: WordPromptProps) => {
  const [selectedWord, setSelectedWord] = useState(word);
  const [hasSelected, setHasSelected] = useState(false);

  const handleWordSelect = (word: string) => {
    if (onWordSelect) {
      setSelectedWord(word);
      setHasSelected(true);
      onWordSelect(word);
    }
  };

  if (wordOptions && wordOptions.length > 0 && onWordSelect && !hasSelected) {
    return (
      <div className="flex flex-col gap-4 p-8 bg-white rounded-2xl shadow-lg animate-fade-in border-2 border-primary/20">
        <h2 className="text-2xl font-bold text-game-text text-center animate-bounce-light">
          Choose a word to draw:
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {wordOptions.map((option) => (
            <Button
              key={option}
              onClick={() => handleWordSelect(option)}
              className="flex-1 text-lg px-8 py-6 rounded-xl transform transition-all duration-200 hover:scale-105 hover:shadow-lg min-w-[120px] max-w-[200px]"
              variant="outline"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-2xl shadow-lg animate-fade-in border-2 border-primary/20">
      <h2 className="text-2xl font-bold text-game-text animate-bounce-light">
        Draw: {selectedWord}
      </h2>
    </div>
  );
};