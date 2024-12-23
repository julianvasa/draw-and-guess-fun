import { Button } from "@/components/ui/button";
import { UserList } from "@/components/UserList";

interface GameHeaderProps {
  roomId: string | null;
  onLeaveRoom: () => void;
}

export const GameHeader = ({ roomId, onLeaveRoom }: GameHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-4xl font-bold text-game-text animate-fade-in">
        Drawing Charades
      </h1>
      {roomId && (
        <div className="flex items-center gap-4">
          <UserList />
          <div className="flex items-center gap-4">
            <p className="text-sm font-medium">Room: {roomId}</p>
            <Button variant="outline" size="sm" onClick={onLeaveRoom}>
              Leave Room
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};