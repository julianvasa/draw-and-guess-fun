import { useState } from "react";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { GameTimer } from "@/components/GameTimer";
import { WordPrompt } from "@/components/WordPrompt";
import { RoomManager } from "@/components/RoomManager";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

const WORDS = [
  "elephant", "pizza", "rainbow", "computer", "beach",
  "bicycle", "guitar", "penguin", "rocket", "butterfly"
];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [isPlaying, setIsPlaying] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(searchParams.get("room"));

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

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setSearchParams({ room: newRoomId });
    setIsPlaying(true);
    toast.success("Room created! Share this link with your friends:", {
      description: window.location.href,
      duration: 10000,
    });
  };

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    setSearchParams({ room: id });
    setIsPlaying(true);
    toast.success("Joined room successfully!");
  };

  const handleLeaveRoom = () => {
    setRoomId(null);
    setSearchParams({});
    setIsPlaying(false);
    toast("Left the room");
  };

  return (
    <div className="min-h-screen bg-game-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-game-text animate-fade-in">
            Drawing Charades
          </h1>
          {roomId && (
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">Room: {roomId}</p>
              <Button variant="outline" size="sm" onClick={handleLeaveRoom}>
                Leave Room
              </Button>
            </div>
          )}
        </div>

        {!roomId ? (
          <RoomManager onJoinRoom={handleJoinRoom} onCreateRoom={handleCreateRoom} />
        ) : isPlaying ? (
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