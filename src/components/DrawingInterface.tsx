import { WordPrompt } from "@/components/WordPrompt";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { useState } from "react";

interface DrawingInterfaceProps {
  currentWord: string;
  onNewWord: () => void;
  onTimeUp: () => void;
  onFinishDrawing: () => void;
  wordOptions?: string[];
  onWordSelect?: (word: string) => void;
}

export const DrawingInterface = ({ 
  currentWord, 
  onNewWord, 
  onTimeUp, 
  onFinishDrawing,
  wordOptions,
  onWordSelect
}: DrawingInterfaceProps) => {
  const [isTimerActive, setIsTimerActive] = useState(false);

  const handleWordSelect = (word: string) => {
    if (onWordSelect) {
      onWordSelect(word);
      setIsTimerActive(true);
    }
  };

  return (
    <>
      <div className="flex justify-center mb-6">
        <WordPrompt 
          word={currentWord} 
          onNewWord={onNewWord}
          wordOptions={wordOptions}
          onWordSelect={handleWordSelect}
        />
      </div>
      <DrawingCanvas 
        onFinishDrawing={onFinishDrawing} 
        currentWord={currentWord}
      />
    </>
  );
};