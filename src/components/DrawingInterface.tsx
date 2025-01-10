import { WordPrompt } from "@/components/WordPrompt";
import { GameTimer } from "@/components/GameTimer";
import { DrawingCanvas } from "@/components/DrawingCanvas";

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
  return (
    <>
      <div className="flex justify-center mb-6">
        <WordPrompt 
          word={currentWord} 
          onNewWord={onNewWord}
          wordOptions={wordOptions}
          onWordSelect={onWordSelect}
        />
      </div>
      <div className="flex justify-center mb-6">
        <GameTimer duration={60} onTimeUp={onTimeUp} />
      </div>
      <DrawingCanvas 
        onFinishDrawing={onFinishDrawing} 
        currentWord={currentWord}
      />
    </>
  );
};