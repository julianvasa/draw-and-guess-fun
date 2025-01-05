import { useState } from "react";
import { Menu, X, Users, Home, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { UserList } from "./UserList";

interface NavigationBarProps {
  roomId: string | null;
  onLeaveRoom?: () => void;
}

export const NavigationBar = ({ roomId, onLeaveRoom }: NavigationBarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    console.log("Mobile menu toggled:", !isMobileMenuOpen);
  };

  const handleCopyRoomUrl = () => {
    if (roomId) {
      const url = window.location.origin + window.location.pathname + '?room=' + roomId;
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 lg:hidden"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
            <img 
              src="/lovable-uploads/8d5f041a-19ea-4f8d-a146-c3f4620fffbf.png" 
              alt="Drawing Clues - Sketch. Guess. Win!" 
              className="h-8 animate-fade-in"
            />
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {roomId && (
              <>
                <UserList />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <p 
                      className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                      onClick={handleCopyRoomUrl}
                      title="Click to copy room URL"
                    >
                      Room: {roomId}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onLeaveRoom}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Leave Room
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-2">
              {roomId && (
                <>
                  <div className="p-2">
                    <UserList />
                  </div>
                  <div className="p-2">
                    <p 
                      className="text-sm font-medium cursor-pointer hover:text-primary transition-colors flex items-center gap-2"
                      onClick={handleCopyRoomUrl}
                    >
                      <Home className="h-4 w-4" />
                      Room: {roomId}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2"
                    onClick={onLeaveRoom}
                  >
                    <LogOut className="h-4 w-4" />
                    Leave Room
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};