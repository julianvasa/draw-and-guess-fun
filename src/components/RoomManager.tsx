import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface RoomManagerProps {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
}

export const RoomManager = ({ onJoinRoom, onCreateRoom }: RoomManagerProps) => {
  const [roomId, setRoomId] = useState("");

  const handleJoinRoom = () => {
    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }
    onJoinRoom(roomId);
  };

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
      <div className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">Join or Create a Room</h2>
        <p className="text-muted-foreground">Play with friends by joining their room or create your own!</p>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <div className="flex gap-2">
          <Input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJoinRoom()}
          />
          <Button onClick={handleJoinRoom}>Join</Button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <Button onClick={onCreateRoom} variant="outline" className="w-full">
          Create New Room
        </Button>
      </div>
    </div>
  );
};