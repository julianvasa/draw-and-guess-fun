import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RoomManager } from "@/components/RoomManager";
import { GameHeader } from "@/components/GameHeader";
import { DrawingInterface } from "@/components/DrawingInterface";
import { GuessingInterface } from "@/components/GuessingInterface";
import { GameOver } from "@/components/GameOver";
import { useUser } from "@/contexts/UserContext";
import { ActiveUsersList } from "@/components/ActiveUsersList";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";

const WORDS = [
  "elephant", "pizza", "rainbow", "computer", "beach",
  "bicycle", "guitar", "penguin", "rocket", "butterfly"
];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

export const GameContent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [isPlaying, setIsPlaying] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(searchParams.get("room"));
  const [guess, setGuess] = useState("");
  const { username, users, setUsers, currentDrawingUser, setCurrentDrawingUser } = useUser();

  const userId = useState(() => Math.random().toString(36).substring(7))[0];

  useEffect(() => {
    if (roomId) {
      const syncWord = () => {
        const roomData = JSON.parse(sessionStorage.getItem(roomId) || "{}");
        if (roomData.currentWord && roomData.currentWord !== currentWord) {
          console.log("Syncing word:", roomData.currentWord);
          setCurrentWord(roomData.currentWord);
        }
      };

      syncWord();
      const interval = setInterval(syncWord, 1000);
      return () => clearInterval(interval);
    }
  }, [roomId, currentWord]);

  const handleNewWord = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    if (roomId) {
      const roomData = JSON.parse(sessionStorage.getItem(roomId) || "{}");
      sessionStorage.setItem(roomId, JSON.stringify({
        ...roomData,
        currentWord: newWord
      }));
    }
  };

  const handleTimeUp = () => {
    setIsPlaying(false);
    if (currentDrawingUser) {
      const currentIndex = users.findIndex(user => user.id === currentDrawingUser);
      const nextIndex = (currentIndex + 1) % users.length;
      setCurrentDrawingUser(users[nextIndex].id);
    }
  };

  const handleFinishDrawing = () => {
    setIsPlaying(false);
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setSearchParams({ room: newRoomId });
    setIsPlaying(true);
    const newUser = { id: userId, name: username, points: 0 };
    setUsers([newUser]);
    setCurrentDrawingUser(userId);
    sessionStorage.setItem(newRoomId, JSON.stringify({ 
      creator: newUser,
      users: [newUser],
      currentDrawingUser: userId,
      currentWord
    }));
    
    console.log("Room created:", newRoomId);
  };

  const handleJoinRoom = (id: string) => {
    setRoomId(id);
    setSearchParams({ room: id });
    setIsPlaying(true);
    
    const roomData = JSON.parse(sessionStorage.getItem(id) || "{}");
    const newUser = { id: userId, name: username, points: 0 };
    const updatedUsers = [...(roomData.users || []), newUser];
    
    if (roomData.currentWord) {
      setCurrentWord(roomData.currentWord);
    }
    
    sessionStorage.setItem(id, JSON.stringify({ 
      ...roomData,
      users: updatedUsers,
      currentDrawingUser: roomData.currentDrawingUser || userId
    }));
    
    setUsers(updatedUsers);
    setCurrentDrawingUser(roomData.currentDrawingUser || userId);
    console.log("Joined room:", id);
  };

  const handleGuess = () => {
    if (guess.toLowerCase() === currentWord.toLowerCase()) {
      console.log("Correct guess!");
      const updatedUsers = users.map(user => {
        if (user.id === userId) {
          return { ...user, points: (user.points || 0) + 10 };
        }
        return user;
      });
      setUsers(updatedUsers);
      handleTimeUp();
      handleNewWord();
    } else {
      console.log("Wrong guess:", guess);
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
    console.log("Left room");
  };

  const handleCopyRoomLink = () => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString());
    toast.success("Room URL copied to clipboard!");
    console.log("Room URL copied");
  };

  return (
    <div className="min-h-screen bg-game-background">
      <GameHeader 
        roomId={roomId} 
        onLeaveRoom={handleLeaveRoom} 
        onCopyRoomLink={handleCopyRoomLink}
      />
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <Logo />
          {!roomId ? (
            <RoomManager onJoinRoom={handleJoinRoom} onCreateRoom={handleCreateRoom} />
          ) : isPlaying ? (
            <div className="flex gap-8">
              <div className="flex-1">
                {currentDrawingUser === userId ? (
                  <DrawingInterface
                    currentWord={currentWord}
                    onNewWord={handleNewWord}
                    onTimeUp={handleTimeUp}
                    onFinishDrawing={handleFinishDrawing}
                  />
                ) : (
                  <GuessingInterface
                    guess={guess}
                    onGuessChange={setGuess}
                    onGuessSubmit={handleGuess}
                  />
                )}
              </div>
              <ActiveUsersList />
            </div>
          ) : (
            <GameOver
              onPlayAgain={() => {
                setIsPlaying(true);
                handleNewWord();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};