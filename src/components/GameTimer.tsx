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
    const timer = setInterval(() => {
      console.log("Timer tick - current time:", timeLeft);
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        console.log("New time will be:", newTime);
        if (newTime <= 0) {
          clearInterval(timer);
          console.log("Time's up! Calling onTimeUp callback");
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      console.log("Cleaning up timer");
      clearInterval(timer);
    };
  }, [onTimeUp]); // Only recreate interval when onTimeUp changes

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