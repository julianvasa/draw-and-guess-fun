import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface UseRoomActionsProps {
  userId: string;
  username: string;
  setRoomId: (id: string | null) => void;
  setSearchParams: (params: any) => void;
  setIsPlaying: (playing: boolean) => void;
  setCurrentWord: (word: string) => void;
  setCurrentDrawingUser: (userId: string | null) => void;
  setUsers: (users: any[]) => void;
  wordOptions: string[];
}

export const useRoomActions = ({
  userId,
  username,
  setRoomId,
  setSearchParams,
  setIsPlaying,
  setCurrentWord,
  setCurrentDrawingUser,
  setUsers,
  wordOptions
}: UseRoomActionsProps) => {
  const handleNewWord = async () => {
    const roomId = new URLSearchParams(window.location.search).get("room");
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
    const roomId = new URLSearchParams(window.location.search).get("room");
    if (roomId) {
      await supabase
        .from('rooms')
        .update({ current_word: word })
        .eq('id', roomId);
    }
  };

  const handleCreateRoom = async () => {
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const { error: roomError } = await supabase
      .from('rooms')
      .insert({
        id: newRoomId,
        current_drawing_user: userId,
        current_word: wordOptions[0]
      });

    if (roomError) {
      toast.error("Failed to create room");
      return;
    }

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
    const { data: room } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single();

    if (!room) {
      toast.error("Room not found");
      return;
    }

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
    const roomId = new URLSearchParams(window.location.search).get("room");
    if (roomId) {
      await supabase
        .from('room_users')
        .delete()
        .eq('room_id', roomId)
        .eq('user_id', userId);

      const { data: remainingUsers } = await supabase
        .from('room_users')
        .select('*')
        .eq('room_id', roomId);

      if (!remainingUsers?.length) {
        await supabase
          .from('rooms')
          .delete()
          .eq('id', roomId);
      } else if (userId === remainingUsers[0].user_id) {
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
    handleNewWord,
    handleWordSelect,
    handleCreateRoom,
    handleJoinRoom,
    handleLeaveRoom
  };
};