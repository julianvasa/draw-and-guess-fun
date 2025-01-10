import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface WordPromptProps {
  word: string;
  onNewWord: () => void;
  wordOptions?: string[];
  onWordSelect?: (word: string) => void;
}

export const WordPrompt = ({ word, onNewWord, wordOptions, onWordSelect }: WordPromptProps) => {
  const [selectedWord, setSelectedWord] = useState(word);

  if (wordOptions && wordOptions.length > 0 && onWordSelect) {
    return (
      <div className="flex flex-col gap-4 p-6 bg-white rounded-lg shadow animate-fade-in">
        <h2 className="text-xl font-semibold text-game-text mb-2">Choose a word to draw:</h2>
        <RadioGroup
          value={selectedWord}
          onValueChange={(value) => {
            setSelectedWord(value);
            onWordSelect(value);
          }}
          className="gap-4"
        >
          {wordOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={option} />
              <Label htmlFor={option}>{option}</Label>
            </div>
          ))}
        </RadioGroup>
        <Button variant="ghost" size="icon" onClick={onNewWord} className="self-end">
          <Shuffle className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow animate-fade-in">
      <h2 className="text-xl font-semibold text-game-text">Draw: {word}</h2>
      <Button variant="ghost" size="icon" onClick={onNewWord}>
        <Shuffle className="h-4 w-4" />
      </Button>
    </div>
  );
};