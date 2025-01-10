import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
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
        <Button variant="ghost" size="icon" onClick={onNewWord} className="self-end">
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow animate-fade-in">
      <h2 className="text-xl font-semibold text-game-text">Draw: {selectedWord}</h2>
      <Button variant="ghost" size="icon" onClick={onNewWord}>
        <Shuffle className="h-4 w-4" />
      </Button>
    </div>
  );
};