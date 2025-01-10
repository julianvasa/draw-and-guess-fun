import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface GameTimerProps {
  duration: number;
  onTimeUp: () => void;
  isActive?: boolean;
}

export const GameTimer = ({ duration, onTimeUp, isActive = false }: GameTimerProps) => {
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
    <div className="w-full max-w-md space-y-4 p-6 bg-white rounded-2xl shadow-lg animate-fade-in border-2 border-primary/20">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-game-text">Time Remaining</h3>
        <span className="text-2xl font-bold text-primary">
          {formatTime(timeLeft)}
        </span>
      </div>
      <Progress 
        value={progress} 
        className="h-3 bg-secondary/20" 
        indicatorClassName="bg-gradient-to-r from-primary to-secondary transition-all duration-500"
      />
      {!isActive && (
        <p className="text-center text-sm text-game-text opacity-75 animate-bounce-light">
          Select a word to start the timer
        </p>
      )}
    </div>
  );
};