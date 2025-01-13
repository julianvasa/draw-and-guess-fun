import { useRoomState } from "./room/useRoomState";
import { useRoomSubscriptions } from "./room/useRoomSubscriptions";
import { useRoomActions } from "./room/useRoomActions";

export const useRoom = () => {
  const state = useRoomState();
  
  useRoomSubscriptions({
    roomId: state.roomId,
    setCurrentWord: state.setCurrentWord,
    setCurrentDrawingUser: state.setCurrentDrawingUser,
    setUsers: state.setUsers
  });

  const actions = useRoomActions({
    userId: state.userId,
    username: state.username,
    setRoomId: state.setRoomId,
    setSearchParams: state.setSearchParams,
    setIsPlaying: state.setIsPlaying,
    setCurrentWord: state.setCurrentWord,
    setCurrentDrawingUser: state.setCurrentDrawingUser,
    setUsers: state.setUsers,
    wordOptions: state.wordOptions
  });

  return {
    ...state,
    ...actions
  };
};