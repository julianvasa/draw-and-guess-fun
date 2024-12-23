import React, { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  users: string[];
  setUsers: (users: string[]) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<string[]>([]);

  return (
    <UserContext.Provider value={{ username, setUsername, users, setUsers }}>
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