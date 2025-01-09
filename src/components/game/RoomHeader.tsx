import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";

interface RoomHeaderProps {
  roomId: string | null;
  onLeaveRoom: () => void;
}

export const RoomHeader = ({ roomId, onLeaveRoom }: RoomHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
          {roomId && (
            <>
              <span className="text-sm font-medium text-gray-500">
                Room ID: {roomId}
              </span>
              <Button
                variant="ghost"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={onLeaveRoom}
              >
                Leave Room
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};