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
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow animate-fade-in">
        <h2 className="text-xl font-semibold text-game-text mb-2">Choose a word to draw:</h2>
        <div className="flex gap-4">
          {wordOptions.map((option) => (
            <Button
              key={option}
              onClick={() => handleWordSelect(option)}
              className="flex-1 text-lg"
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
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow animate-fade-in">
      <h2 className="text-xl font-semibold text-game-text">Draw: {selectedWord}</h2>
    </div>
  );
};