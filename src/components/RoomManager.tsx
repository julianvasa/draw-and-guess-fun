import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

interface RoomManagerProps {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
}

export const RoomManager = ({ onJoinRoom, onCreateRoom }: RoomManagerProps) => {
  const [roomId, setRoomId] = useState("");
  const { username, setUsername } = useUser();
  const [showNameInput, setShowNameInput] = useState(true);

  const handleJoinRoom = async () => {
    if (!username.trim()) {
      toast.error("Please enter your name first");
      return;
    }
    
    if (!roomId.trim()) {
      toast.error("Please enter a room ID");
      return;
    }

    const roomData = sessionStorage.getItem(roomId);
    if (!roomData) {
      toast.error("This room doesn't exist");
      return;
    }

    onJoinRoom(roomId);
  };

  const handleCreateRoom = () => {
    if (!username.trim()) {
      toast.error("Please enter your name first");
      return;
    }
    onCreateRoom();
  };

  if (showNameInput) {
    return (
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Input
            placeholder="Your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setShowNameInput(false)}
          />
          <Button 
            onClick={() => {
              if (!username.trim()) {
                toast.error("Please enter your name");
                return;
              }
              setShowNameInput(false);
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 animate-fade-in">
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

        <Button onClick={handleCreateRoom} variant="outline" className="w-full">
          Create New Room
        </Button>
      </div>
    </div>
  );
};