import { Button } from "@/components/ui/button";

interface GameOverProps {
  onPlayAgain: () => void;
}

export const GameOver = ({ onPlayAgain }: GameOverProps) => {
  return (
    <div className="text-center space-y-4 animate-fade-in">
      <h2 className="text-2xl font-semibold text-game-text">Game Over!</h2>
      <Button onClick={onPlayAgain}>Play Again</Button>
    </div>
  );
};