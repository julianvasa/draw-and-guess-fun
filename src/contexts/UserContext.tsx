import React, { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  points: number;
}

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  users: User[];
  setUsers: (users: User[]) => void;
  currentDrawingUser: string | null;
  setCurrentDrawingUser: (userId: string | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [currentDrawingUser, setCurrentDrawingUser] = useState<string | null>(null);

  return (
    <UserContext.Provider 
      value={{ 
        username, 
        setUsername, 
        users, 
        setUsers,
        currentDrawingUser,
        setCurrentDrawingUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}