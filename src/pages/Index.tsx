import { useState } from "react";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { GameTimer } from "@/components/GameTimer";
import { WordPrompt } from "@/components/WordPrompt";
import { RoomManager } from "@/components/RoomManager";
import { UserList } from "@/components/UserList";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";

const WORDS = [
  "elephant", "pizza", "rainbow", "computer", "beach",
  "bicycle", "guitar", "penguin", "rocket", "butterfly"
];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

const GameContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [isPlaying, setIsPlaying] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(searchParams.get("room"));
  const { username, setUsers } = useUser();

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
    // Store room info in sessionStorage
    sessionStorage.setItem(newRoomId, JSON.stringify({ creator: username }));
    setUsers([username]);
    toast.success("Room created! Share this link with your friends:", {
      description: window.location.href,
      duration: 10000,
    });
  };

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    setSearchParams({ room: id });
    setIsPlaying(true);
    // Update users list
    const roomData = JSON.parse(sessionStorage.getItem(id) || "{}");
    const updatedUsers = [...(roomData.users || [roomData.creator]), username];
    sessionStorage.setItem(id, JSON.stringify({ ...roomData, users: updatedUsers }));
    setUsers(updatedUsers);
    toast.success("Joined room successfully!");
  };

  const handleLeaveRoom = () => {
    if (roomId) {
      const roomData = JSON.parse(sessionStorage.getItem(roomId) || "{}");
      const updatedUsers = (roomData.users || []).filter((user: string) => user !== username);
      sessionStorage.setItem(roomId, JSON.stringify({ ...roomData, users: updatedUsers }));
    }
    setRoomId(null);
    setSearchParams({});
    setIsPlaying(false);
    setUsers([]);
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
              <UserList />
              <div className="flex items-center gap-4">
                <p className="text-sm font-medium">Room: {roomId}</p>
                <Button variant="outline" size="sm" onClick={handleLeaveRoom}>
                  Leave Room
                </Button>
              </div>
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

const Index = () => {
  return (
    <UserProvider>
      <GameContent />
    </UserProvider>
  );
};

export default Index;