import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export const NavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    console.log("Mobile menu toggled:", !isMobileMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
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
            <span className="font-semibold text-xl">Drawing Game</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost">How to Play</Button>
            <Button variant="ghost">Leaderboard</Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden animate-fade-in">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
              >
                How to Play
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
              >
                Leaderboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};