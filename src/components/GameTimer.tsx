import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface GameTimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive?: boolean;
  className?: string;
}

export const GameTimer = ({ duration, onTimeUp, isActive = false, className = "" }: GameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const progress = (timeLeft / duration) * 100;

  useEffect(() => {
    console.log("Timer started with duration:", duration);
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!isActive) {
      console.log("Timer not active yet");
      return;
    }

    console.log("Starting timer countdown");
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
  }, [onTimeUp, isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-game-text">Time Remaining</span>
        <span className="text-lg font-bold text-primary">
          {formatTime(timeLeft)}
        </span>
      </div>
      <Progress 
        value={progress} 
        className="h-2 bg-secondary/20 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary [&>div]:transition-all [&>div]:duration-500"
      />
      {!isActive && (
        <p className="text-xs text-game-text opacity-75">
          Select a word to start the timer
        </p>
      )}
    </div>
  );
};