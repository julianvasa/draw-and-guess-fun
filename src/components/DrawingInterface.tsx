import { WordPrompt } from "@/components/WordPrompt";
import { GameTimer } from "@/components/GameTimer";
import { DrawingCanvas } from "@/components/DrawingCanvas";

interface DrawingInterfaceProps {
  currentWord: string;
  onNewWord: () => void;
  onTimeUp: () => void;
  onFinishDrawing: () => void;
}

export const DrawingInterface = ({ 
  currentWord, 
  onNewWord, 
  onTimeUp, 
  onFinishDrawing 
}: DrawingInterfaceProps) => {
  return (
    <>
      <div className="flex justify-center mb-6">
        <WordPrompt word={currentWord} onNewWord={onNewWord} />
      </div>
      <div className="flex justify-center mb-6">
        <GameTimer duration={60} onTimeUp={onTimeUp} />
      </div>
      <DrawingCanvas onFinishDrawing={onFinishDrawing} />
    </>
  );
};