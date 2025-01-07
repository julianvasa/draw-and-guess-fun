import { Home } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface GameHeaderProps {
  roomId: string | null;
  onLeaveRoom: () => void;
  onCopyRoomLink: () => void;
}

export const GameHeader = ({ roomId, onLeaveRoom, onCopyRoomLink }: GameHeaderProps) => {
  if (!roomId) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 p-4 mb-8">
      <div className="max-w-7xl mx-auto flex justify-end items-center gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
          onClick={onCopyRoomLink}
          title="Click to copy room URL"
        >
          <Home className="h-4 w-4" />
          <p className="text-sm font-medium">Room: {roomId}</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLeaveRoom}
          className="flex items-center gap-2"
        >
          Leave Room
        </Button>
      </div>
    </div>
  );
};