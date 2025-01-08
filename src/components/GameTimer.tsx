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
    console.log("Timer started with duration:", duration);
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    console.log("Current time left:", timeLeft);
    
    if (timeLeft <= 0) {
      console.log("Time's up! Calling onTimeUp callback");
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      console.log("Clearing timer interval");
      clearInterval(timer);
    };
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