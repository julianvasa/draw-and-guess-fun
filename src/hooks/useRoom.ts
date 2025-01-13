import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import { getRandomWord } from "@/utils/wordUtils";
import { supabase } from "@/lib/supabase";

export const useRoom = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentWord, setCurrentWord] = useState<string>("");
  const [wordOptions, setWordOptions] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(searchParams.get("room"));
  const { username, users, setUsers, currentDrawingUser, setCurrentDrawingUser } = useUser();
  const userId = useState(() => Math.random().toString(36).substring(7))[0];

  useEffect(() => {
    if (!currentWord) {
      fetchWordOptions();
    }
  }, [currentWord]);

  useEffect(() => {
    if (roomId) {
      // Subscribe to room changes
      const roomSubscription = supabase
        .channel(`room:${roomId}`)
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
          async (payload) => {
            console.log('Room updated:', payload);
            if (payload.new) {
              setCurrentWord(payload.new.current_word || '');
              setCurrentDrawingUser(payload.new.current_drawing_user);
            }
          }
        )
        .subscribe();

      // Subscribe to room users changes
      const usersSubscription = supabase
        .channel(`room_users:${roomId}`)
        .on('postgres_changes',
          { event: '*', schema: 'public', table: 'room_users', filter: `room_id=eq.${roomId}` },
          async () => {
            console.log('Users updated, fetching latest');
            const { data: roomUsers } = await supabase
              .from('room_users')
              .select('*')
              .eq('room_id', roomId);
            
            if (roomUsers) {
              setUsers(roomUsers.map(user => ({
                id: user.user_id,
                name: user.username,
                points: user.points
              })));
            }
          }
        )
        .subscribe();

      // Initial room data fetch
      fetchRoomData();

      return () => {
        roomSubscription.unsubscribe();
        usersSubscription.unsubscribe();
      };
    }
  }, [roomId]);

  const fetchRoomData = async () => {
    if (!roomId) return;

    const { data: room } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', roomId)
      .single();

    if (room) {
      setCurrentWord(room.current_word || '');
      setCurrentDrawingUser(room.current_drawing_user);
    }

    const { data: roomUsers } = await supabase
      .from('room_users')
      .select('*')
      .eq('room_id', roomId);

    if (roomUsers) {
      setUsers(roomUsers.map(user => ({
        id: user.user_id,
        name: user.username,
        points: user.points
      })));
    }
  };

  const fetchWordOptions = async () => {
    const words = await Promise.all([
      getRandomWord(),
      getRandomWord(),
      getRandomWord()
    ]);
    setWordOptions(words);
    setCurrentWord(words[0]);
  };

  const handleNewWord = async () => {
    await fetchWordOptions();
    if (roomId) {
      await supabase
        .from('rooms')
        .update({ current_word: wordOptions[0] })
        .eq('id', roomId);
    }
  };

  const handleWordSelect = async (word: string) => {
    console.log("Selected word:", word);
    setCurrentWord(word);
    if (roomId) {
      await supabase
        .from('rooms')
        .update({ current_word: word })
        .eq('id', roomId);
    }
  };

  const handleCreateRoom = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Create room in Supabase
    const { error: roomError } = await supabase
      .from('rooms')
      .insert({
        id: newRoomId,
        current_drawing_user: userId,
        current_word: currentWord
      });

    if (roomError) {
      toast.error("Failed to create room");
      return;
    }

    // Add creator to room_users
    const { error: userError } = await supabase
      .from('room_users')
      .insert({
        room_id: newRoomId,
        user_id: userId,
        username: username,
        points: 0
      });

    if (userError) {
      toast.error("Failed to join room");
      return;
    }

    setRoomId(newRoomId);
    setSearchParams({ room: newRoomId });
    setIsPlaying(true);
    setCurrentDrawingUser(userId);
    
    console.log("Room created:", newRoomId);
    toast.success("Room created successfully!");
  };

  const handleJoinRoom = async (id: string) => {
    // Check if room exists
    const { data: room } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (!room) {
      toast.error("Room not found");
      return;
    }

    // Check if user is already in room
    const { data: existingUser } = await supabase
      .from('room_users')
      .select('*')
      .eq('room_id', id)
      .eq('user_id', userId)
      .single();

    if (existingUser) {
      toast.error("You are already in this room");
      return;
    }

    // Add user to room
    const { error: userError } = await supabase
      .from('room_users')
      .insert({
        room_id: id,
        user_id: userId,
        username: username,
        points: 0
      });

    if (userError) {
      toast.error("Failed to join room");
      return;
    }

    setRoomId(id);
    setSearchParams({ room: id });
    setIsPlaying(true);
    setCurrentWord(room.current_word || '');
    setCurrentDrawingUser(room.current_drawing_user);
    
    console.log("Joined room:", id);
    toast.success("Joined room successfully!");
  };

  const handleLeaveRoom = async () => {
    if (roomId) {
      // Remove user from room
      await supabase
        .from('room_users')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId);

      // Check if room is empty
      const { data: remainingUsers } = await supabase
        .from('room_users')
        .select('*')
        .eq('room_id', roomId);

      if (!remainingUsers?.length) {
        // Delete empty room
        await supabase
          .from('rooms')
          .delete()
          .eq('id', roomId);
      } else if (currentDrawingUser === userId) {
        // If leaving user was drawing, assign new drawing user
        await supabase
          .from('rooms')
          .update({ current_drawing_user: remainingUsers[0].user_id })
          .eq('id', roomId);
      }
    }

    setRoomId(null);
    setSearchParams({});
    setIsPlaying(false);
    setUsers([]);
    console.log("Left room");
    toast.success("Left room successfully");
  };

  return {
    roomId,
    isPlaying,
    currentWord,
    wordOptions,
    userId,
    handleNewWord,
    handleWordSelect,
    handleCreateRoom,
    handleJoinRoom,
    handleLeaveRoom,
    setIsPlaying
  };
};