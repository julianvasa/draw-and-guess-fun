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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  };

  return (
    <div className="w-full max-w-md space-y-2">
      <Progress value={progress} className="h-2" />
      <p className="text-center text-sm text-game-text">
        Time left: {formatTime(timeLeft)}
      </p>
    </div>
  );
};