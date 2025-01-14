import { Home, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { GameTimer } from "./GameTimer";

interface GameHeaderProps {
  roomId: string | null;
  onLeaveRoom: () => void;
  onCopyRoomLink: () => void;
  duration?: number;
  onTimeUp?: () => void;
  isActive?: boolean;
}

export const GameHeader = ({ 
  roomId, 
  onLeaveRoom, 
  onCopyRoomLink,
  duration,
  onTimeUp,
  isActive 
}: GameHeaderProps) => {
  if (!roomId) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors bg-white/90 rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300"
          onClick={onCopyRoomLink}
          title="Click to copy room URL"
        >
          <Home className="h-4 w-4 animate-pulse" />
          <p className="text-sm font-medium">Room: {roomId}</p>
        </div>
        {duration && onTimeUp && (
          <GameTimer 
            duration={duration} 
            onTimeUp={onTimeUp} 
            isActive={isActive}
            className="flex-1 mx-4"
          />
        )}
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={onLeaveRoom}
          className="flex items-center gap-2 rounded-full hover:scale-105 transition-transform duration-300"
        >
          <LogOut className="h-4 w-4" />
          <span>Leave Room</span>
        </Button>
      </div>
    </div>
  );
};