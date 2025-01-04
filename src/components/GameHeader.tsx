import { Button } from "@/components/ui/button";
import { UserList } from "@/components/UserList";
import { toast } from "sonner";

interface GameHeaderProps {
  roomId: string | null;
  onLeaveRoom: () => void;
}

export const GameHeader = ({ roomId, onLeaveRoom }: GameHeaderProps) => {
  const handleCopyRoomUrl = () => {
    if (roomId) {
      const url = `${window.location.origin}/?room=${roomId}`;
      navigator.clipboard.writeText(url);
      toast.success("Room URL copied to clipboard!");
    }
  };

  return (
    <div className="flex justify-between items-center">
      <img 
        src="/lovable-uploads/8af83f4c-735f-43a5-acf7-828966f8b237.png" 
        alt="Drawing Clues - Sketch. Guess. Win!" 
        className="h-16 animate-fade-in"
      />
      {roomId && (
        <div className="flex items-center gap-4">
          <UserList />
          <div className="flex items-center gap-4">
            <p 
              className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
              onClick={handleCopyRoomUrl}
              title="Click to copy room URL"
            >
              Room: {roomId}
            </p>
            <Button variant="outline" size="sm" onClick={onLeaveRoom}>
              Leave Room
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};