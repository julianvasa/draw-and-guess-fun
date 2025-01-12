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
      <div className="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-lg animate-fade-in border-2 border-primary/20">
        <h2 className="text-lg font-semibold text-game-text text-center">
          Choose a word to draw:
        </h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {wordOptions.map((option) => (
            <Button
              key={option}
              onClick={() => handleWordSelect(option)}
              className="text-sm px-4 py-2 rounded-lg transform transition-all duration-200 hover:scale-105"
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
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-lg animate-fade-in border-2 border-primary/20">
      <h2 className="text-lg font-semibold text-game-text">
        Draw: {selectedWord}
      </h2>
    </div>
  );
};