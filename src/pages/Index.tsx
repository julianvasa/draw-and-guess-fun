import { UserProvider } from "@/contexts/UserContext";
import { GameContent } from "@/components/game/GameContent";

const Index = () => {
  return (
    <UserProvider>
      <GameContent />
    </UserProvider>
  );
};

export default Index;