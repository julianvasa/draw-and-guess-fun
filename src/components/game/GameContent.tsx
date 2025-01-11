import { RoomManager } from "@/components/RoomManager";
import { DrawingInterface } from "@/components/DrawingInterface";
import { GuessingInterface } from "@/components/GuessingInterface";
import { GameOver } from "@/components/GameOver";
import { ActiveUsersList } from "@/components/ActiveUsersList";
import { GuessChat } from "@/components/GuessChat";
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
    wordOptions, 
    userId,
    handleNewWord,
    handleWordSelect,
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
      <div className="p-4">
        <div className="max-w-[1800px] mx-auto">
          <Logo />
          {!roomId ? (
            <RoomManager onJoinRoom={handleJoinRoom} onCreateRoom={handleCreateRoom} />
          ) : isPlaying ? (
            <div className="flex gap-4">
              <ActiveUsersList />
              <div className="flex-1">
                {currentDrawingUser === userId ? (
                  <DrawingInterface
                    currentWord={currentWord}
                    onNewWord={handleNewWord}
                    onTimeUp={() => setIsPlaying(false)}
                    onFinishDrawing={() => setIsPlaying(false)}
                    wordOptions={wordOptions}
                    onWordSelect={handleWordSelect}
                  />
                ) : (
                  <GuessingInterface
                    guess={guess}
                    onGuessChange={setGuess}
                    onGuessSubmit={handleGuess}
                  />
                )}
              </div>
              {roomId && <GuessChat roomId={roomId} />}
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