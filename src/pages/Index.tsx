import { useState } from "react";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { GameTimer } from "@/components/GameTimer";
import { WordPrompt } from "@/components/WordPrompt";
import { toast } from "sonner";

const WORDS = [
  "elephant", "pizza", "rainbow", "computer", "beach",
  "bicycle", "guitar", "penguin", "rocket", "butterfly"
];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const Index = () => {
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [isPlaying, setIsPlaying] = useState(true);

  const handleNewWord = () => {
    setCurrentWord(getRandomWord());
    toast("New word generated!");
  };

  const handleTimeUp = () => {
    setIsPlaying(false);
    toast("Time's up!");
  };

  const handleFinishDrawing = () => {
    setIsPlaying(false);
    toast("Drawing completed!");
  };

  return (
    <div className="min-h-screen bg-game-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center text-game-text mb-8 animate-fade-in">
          Drawing Charades
        </h1>
        
        {isPlaying ? (
          <>
            <div className="flex justify-center mb-6">
              <WordPrompt word={currentWord} onNewWord={handleNewWord} />
            </div>
            <div className="flex justify-center mb-6">
              <GameTimer duration={60} onTimeUp={handleTimeUp} />
            </div>
            <DrawingCanvas onFinishDrawing={handleFinishDrawing} />
          </>
        ) : (
          <div className="text-center space-y-4 animate-fade-in">
            <h2 className="text-2xl font-semibold text-game-text">Game Over!</h2>
            <Button
              onClick={() => {
                setIsPlaying(true);
                handleNewWord();
              }}
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;