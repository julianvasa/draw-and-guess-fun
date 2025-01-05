interface GameHeaderProps {
  roomId: string | null;
  onLeaveRoom: () => void;
}

export const GameHeader = ({ roomId, onLeaveRoom }: GameHeaderProps) => {
  return null; // We can remove this component entirely if it's no longer needed
};