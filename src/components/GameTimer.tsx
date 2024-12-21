import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface GameTimerProps {
  duration: number;
  onTimeUp: () => void;
}

export const GameTimer = ({ duration, onTimeUp }: GameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = (timeLeft / duration) * 100;

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <div className="w-full max-w-md space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-center text-sm text-game-text">
        Time left: {timeLeft} seconds
      </p>
    </div>
  );
};