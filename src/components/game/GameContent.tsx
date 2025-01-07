import { RoomManager } from "@/components/RoomManager";
import { DrawingInterface } from "@/components/DrawingInterface";
import { GuessingInterface } from "@/components/GuessingInterface";
import { GameOver } from "@/components/GameOver";
import { ActiveUsersList } from "@/components/ActiveUsersList";
import { Logo } from "@/components/Logo";
import { RoomHeader } from "./RoomHeader";
import { useRoom } from "@/hooks/useRoom";
import { useGame } from "@/hooks/useGame";
import { useUser } from "@/contexts/UserContext";

export const GameContent = () => {
  const { 
    roomId, 
    isPlaying, 
    currentWord, 
    userId,
    handleNewWord,
    handleCreateRoom,
    handleJoinRoom,
    handleLeaveRoom,
    setIsPlaying
  } = useRoom();

  const { currentDrawingUser } = useUser();

  const { guess, setGuess, handleGuess } = useGame(roomId, () => setIsPlaying(false), handleNewWord);

  return (
    <div className="min-h-screen bg-game-background">
      <RoomHeader roomId={roomId} onLeaveRoom={handleLeaveRoom} />
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
                    onTimeUp={() => setIsPlaying(false)}
                    onFinishDrawing={() => setIsPlaying(false)}
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