import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { getRandomWord } from "@/utils/wordUtils";

export const useRoomState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentWord, setCurrentWord] = useState<string>("");
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(searchParams.get("room"));
  const { username, users, setUsers, currentDrawingUser, setCurrentDrawingUser } = useUser();
  const userId = useState(() => Math.random().toString(36).substring(7))[0];

  const fetchWordOptions = async () => {
    const words = await Promise.all([
      getRandomWord(),
      getRandomWord(),
      getRandomWord()
    ]);
    setWordOptions(words);
    setCurrentWord(words[0]);
  };

  return {
    searchParams,
    setSearchParams,
    currentWord,
    setCurrentWord,
    wordOptions,
    setWordOptions,
    isPlaying,
    setIsPlaying,
    roomId,
    setRoomId,
    username,
    users,
    setUsers,
    currentDrawingUser,
    setCurrentDrawingUser,
    userId,
    fetchWordOptions
  };
};