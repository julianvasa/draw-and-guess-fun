import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

export const useGame = (roomId: string | null, onTimeUp: () => void, onNewWord: () => void) => {
  const [guess, setGuess] = useState("");
  const { users, setUsers } = useUser();

  const handleGuess = () => {
    const roomData = roomId ? JSON.parse(sessionStorage.getItem(roomId) || "{}") : null;
    if (roomData?.currentWord && guess.toLowerCase() === roomData.currentWord.toLowerCase()) {
      console.log("Correct guess!");
      const updatedUsers = users.map(user => {
        if (user.id === users.find(u => u.name === guess)?.id) {
          return { ...user, points: (user.points || 0) + 10 };
        }
        return user;
      });
      setUsers(updatedUsers);
      if (roomId) {
        sessionStorage.setItem(roomId, JSON.stringify({
          ...roomData,
          users: updatedUsers
        }));
      }
      onTimeUp();
      onNewWord();
      toast.success("Correct guess! +10 points");
    } else {
      console.log("Wrong guess:", guess);
      toast.error("Wrong guess, try again!");
    }
    setGuess("");
  };

  return {
    guess,
    setGuess,
    handleGuess
  };
};