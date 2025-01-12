import { toast } from "sonner";
import { GameHeader } from "@/components/GameHeader";

interface RoomHeaderProps {
  roomId: string | null;
  onLeaveRoom: () => void;
  duration?: number;
  onTimeUp?: () => void;
  isActive?: boolean;
}

export const RoomHeader = ({ 
  roomId, 
  onLeaveRoom,
  duration,
  onTimeUp,
  isActive 
}: RoomHeaderProps) => {
  const handleCopyRoomLink = () => {
    const url = new URL(window.location.href);
    navigator.clipboard.writeText(url.toString());
    toast.success("Room URL copied to clipboard!");
    console.log("Room URL copied");
  };

  return (
    <GameHeader 
      roomId={roomId} 
      onLeaveRoom={onLeaveRoom} 
      onCopyRoomLink={handleCopyRoomLink}
      duration={duration}
      onTimeUp={onTimeUp}
      isActive={isActive}
    />
  );
};