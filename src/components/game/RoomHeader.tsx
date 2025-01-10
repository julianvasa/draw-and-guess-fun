import { toast } from "sonner";
import { GameHeader } from "@/components/GameHeader";

interface RoomHeaderProps {
  roomId: string | null;
  onLeaveRoom: () => void;
}

export const RoomHeader = ({ roomId, onLeaveRoom }: RoomHeaderProps) => {
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
    />
  );
};