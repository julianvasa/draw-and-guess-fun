import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";

const WORDS = [
  "elephant", "pizza", "rainbow", "computer", "beach",
  "bicycle", "guitar", "penguin", "rocket", "butterfly"
];

const getRandomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

export const useRoom = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentWord, setCurrentWord] = useState(getRandomWord());
  const [isPlaying, setIsPlaying] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(searchParams.get("room"));
  const { username, users, setUsers, currentDrawingUser, setCurrentDrawingUser } = useUser();
  const userId = useState(() => Math.random().toString(36).substring(7))[0];

  useEffect(() => {
    if (roomId) {
      const syncRoomData = () => {
        const roomData = sessionStorage.getItem(roomId);
        if (!roomData) {
          toast.error("Room not found");
          handleLeaveRoom();
          return;
        }

        const parsedData = JSON.parse(roomData);
        if (parsedData.currentWord && parsedData.currentWord !== currentWord) {
          console.log("Syncing word:", parsedData.currentWord);
          setCurrentWord(parsedData.currentWord);
        }

        if (parsedData.users) {
          setUsers(parsedData.users);
        }

        if (parsedData.currentDrawingUser) {
          setCurrentDrawingUser(parsedData.currentDrawingUser);
        }
      };

      syncRoomData();
      const interval = setInterval(syncRoomData, 1000);
      return () => clearInterval(interval);
    }
  }, [roomId, currentWord, setUsers, setCurrentDrawingUser]);

  const handleNewWord = () => {
    const newWord = getRandomWord();
    setCurrentWord(newWord);
    if (roomId) {
      const roomData = JSON.parse(sessionStorage.getItem(roomId) || "{}");
      sessionStorage.setItem(roomId, JSON.stringify({
        ...roomData,
        currentWord: newWord
      }));
    }
  };

  const handleCreateRoom = () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomId(newRoomId);
    setSearchParams({ room: newRoomId });
    setIsPlaying(true);
    const newUser = { id: userId, name: username, points: 0 };
    setUsers([newUser]);
    setCurrentDrawingUser(userId);
    sessionStorage.setItem(newRoomId, JSON.stringify({ 
      creator: newUser,
      users: [newUser],
      currentDrawingUser: userId,
      currentWord
    }));
    
    console.log("Room created:", newRoomId);
    toast.success("Room created successfully!");
  };

  const handleJoinRoom = (id: string) => {
    const roomData = sessionStorage.getItem(id);
    if (!roomData) {
      toast.error("Room not found");
      return;
    }

    const parsedData = JSON.parse(roomData);
    const existingUser = parsedData.users?.find((u: { id: string }) => u.id === userId);
    
    if (existingUser) {
      toast.error("You are already in this room");
      return;
    }

    setRoomId(id);
    setSearchParams({ room: id });
    setIsPlaying(true);
    
    const newUser = { id: userId, name: username, points: 0 };
    const updatedUsers = [...(parsedData.users || []), newUser];
    
    if (parsedData.currentWord) {
      setCurrentWord(parsedData.currentWord);
    }
    
    sessionStorage.setItem(id, JSON.stringify({ 
      ...parsedData,
      users: updatedUsers,
      currentDrawingUser: parsedData.currentDrawingUser || userId
    }));
    
    setUsers(updatedUsers);
    setCurrentDrawingUser(parsedData.currentDrawingUser || userId);
    console.log("Joined room:", id);
    toast.success("Joined room successfully!");
  };

  const handleLeaveRoom = () => {
    if (roomId) {
      const roomData = JSON.parse(sessionStorage.getItem(roomId) || "{}");
      const updatedUsers = roomData.users.filter((user: { id: string }) => user.id !== userId);
      
      if (updatedUsers.length === 0) {
        sessionStorage.removeItem(roomId);
      } else {
        sessionStorage.setItem(roomId, JSON.stringify({ 
          ...roomData, 
          users: updatedUsers,
          currentDrawingUser: updatedUsers[0].id
        }));
      }
      
      setUsers(updatedUsers);
    }
    setRoomId(null);
    setSearchParams({});
    setIsPlaying(false);
    console.log("Left room");
    toast.success("Left room successfully");
  };

  return {
    roomId,
    isPlaying,
    currentWord,
    userId,
    handleNewWord,
    handleCreateRoom,
    handleJoinRoom,
    handleLeaveRoom,
    setIsPlaying
  };
};