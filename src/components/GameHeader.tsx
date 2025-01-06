import { Home } from "lucide-react";
import { Button } from "./ui/button";

interface GameHeaderProps {
  roomId: string | null;
  onLeaveRoom: () => void;
}

export const GameHeader = ({ roomId, onLeaveRoom }: GameHeaderProps) => {
  const handleCopyRoomUrl = () => {
    if (roomId) {
      const url = window.location.origin + window.location.pathname + '?room=' + roomId;
      navigator.clipboard.writeText(url);
      console.log("Room URL copied");
    }
  };

  if (!roomId) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 p-4 mb-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img 
            src="/lovable-uploads/8d5f041a-19ea-4f8d-a146-c3f4620fffbf.png" 
            alt="Drawing Clues - Sketch. Guess. Win!" 
            className="h-8"
          />
        </div>
        <div className="flex items-center gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
            onClick={handleCopyRoomUrl}
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
    </div>
  );
};