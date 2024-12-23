import { useState, useEffect } from "react";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { GameTimer } from "@/components/GameTimer";
import { WordPrompt } from "@/components/WordPrompt";
import { RoomManager } from "@/components/RoomManager";
import { UserList } from "@/components/UserList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [guess, setGuess] = useState("");
  const { username, users, setUsers, currentDrawingUser, setCurrentDrawingUser } = useUser();

  const userId = useState(() => Math.random().toString(36).substring(7))[0];

  const handleNewWord = () => {
    setCurrentWord(getRandomWord());
    toast("New word generated!");
  };

  const handleTimeUp = () => {
    setIsPlaying(false);
    if (currentDrawingUser) {
      const currentIndex = users.findIndex(user => user.id === currentDrawingUser);
      const nextIndex = (currentIndex + 1) % users.length;
      setCurrentDrawingUser(users[nextIndex].id);
    }
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
    const newUser = { id: userId, name: username };
    setUsers([newUser]);
    setCurrentDrawingUser(userId);
    sessionStorage.setItem(newRoomId, JSON.stringify({ 
      creator: newUser,
      users: [newUser],
      currentDrawingUser: userId
    }));
    toast.success("Room created! Share this link with your friends:", {
      description: window.location.href,
      duration: 10000,
    });
  };

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    setSearchParams({ room: id });
    setIsPlaying(true);
    
    const roomData = JSON.parse(sessionStorage.getItem(id) || "{}");
    const newUser = { id: userId, name: username };
    const updatedUsers = [...(roomData.users || []), newUser];
    
    sessionStorage.setItem(id, JSON.stringify({ 
      ...roomData,
      users: updatedUsers,
      currentDrawingUser: roomData.currentDrawingUser || userId
    }));
    
    setUsers(updatedUsers);
    setCurrentDrawingUser(roomData.currentDrawingUser || userId);
    toast.success("Joined room successfully!");
  };

  const handleGuess = () => {
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      toast.success("Correct guess!");
      handleTimeUp(); // Move to next player
      handleNewWord();
    } else {
      toast.error("Wrong guess, try again!");
    }
    setGuess("");
  };

  const handleLeaveRoom = () => {
    if (roomId) {
      const roomData = JSON.parse(sessionStorage.getItem(roomId) || "{}");
      const updatedUsers = roomData.users.filter((user: { id: string }) => user.id !== userId);
      sessionStorage.setItem(roomId, JSON.stringify({ 
        ...roomData, 
        users: updatedUsers,
        currentDrawingUser: updatedUsers.length > 0 ? updatedUsers[0].id : null
      }));
      setUsers(updatedUsers);
    }
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
            {currentDrawingUser === userId ? (
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
              <div className="flex flex-col items-center gap-4">
                <h2 className="text-xl font-semibold">Guess the drawing!</h2>
                <div className="flex gap-2 w-full max-w-md">
                  <Input
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Type your guess here..."
                    onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                  />
                  <Button onClick={handleGuess}>Guess</Button>
                </div>
              </div>
            )}
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