import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface GuessMessage {
  userId: string;
  username: string;
  message: string;
  timestamp: number;
}

export const GuessChat = ({ roomId }: { roomId: string }) => {
  const { users, currentDrawingUser, username } = useUser();
  const [messages, setMessages] = useState<GuessMessage[]>([]);
  const [guess, setGuess] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const storedMessages = sessionStorage.getItem(`${roomId}-messages`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [roomId]);

  const handleSubmitGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guess.trim()) return;

    const currentUser = users.find(u => u.name === username);
    if (!currentUser) return;

    if (currentUser.id === currentDrawingUser) {
      toast.error("Drawing players cannot make guesses!");
      return;
    }

    const newMessage: GuessMessage = {
      userId: currentUser.id,
      username: currentUser.name,
      message: guess,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    sessionStorage.setItem(`${roomId}-messages`, JSON.stringify(updatedMessages));
    setGuess("");

    console.log("New guess submitted:", newMessage);
  };

  return (
    <div className="w-full lg:w-64 bg-white p-4 rounded-lg shadow-sm border border-gray-200 mt-4">
      <h3 className="text-sm font-semibold mb-3">Player Guesses</h3>
      <ScrollArea className="h-[200px] mb-4 pr-4">
        <div className="space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className="text-sm p-2 rounded-lg bg-game-background"
            >
              <span className="font-medium text-primary">{msg.username}: </span>
              <span className="text-game-text">{msg.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmitGuess} className="flex gap-2">
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your guess..."
          disabled={currentDrawingUser === users.find(u => u.name === username)?.id}
          className="text-sm"
        />
      </form>
    </div>
  );
};