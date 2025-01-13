import { useEffect } from "react";
import { supabase, Room, RoomUser } from "@/lib/supabase";

interface UseRoomSubscriptionsProps {
  roomId: string | null;
  setCurrentWord: (word: string) => void;
  setCurrentDrawingUser: (userId: string | null) => void;
  setUsers: (users: any[]) => void;
}

export const useRoomSubscriptions = ({
  roomId,
  setCurrentWord,
  setCurrentDrawingUser,
  setUsers
}: UseRoomSubscriptionsProps) => {
  useEffect(() => {
    if (!roomId) return;

    const roomSubscription = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes' as any, 
        { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomId}` },
        async (payload: { new: Room }) => {
          console.log('Room updated:', payload);
          if (payload.new) {
            setCurrentWord(payload.new.current_word || '');
            setCurrentDrawingUser(payload.new.current_drawing_user || '');
          }
        }
      )
      .subscribe();

    const usersSubscription = supabase
      .channel(`room_users:${roomId}`)
      .on('postgres_changes' as any,
        { event: '*', schema: 'public', table: 'room_users', filter: `room_id=eq.${roomId}` },
        async () => {
          console.log('Users updated, fetching latest');
          const { data: roomUsers } = await supabase
            .from('room_users')
            .select<'*', RoomUser>('*')
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

    return () => {
      roomSubscription.unsubscribe();
      usersSubscription.unsubscribe();
    };
  }, [roomId]);
};