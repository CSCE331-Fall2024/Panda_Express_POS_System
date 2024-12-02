import React, { createContext, useContext, useState } from "react";

interface UserContextType {
  user: { role?: string } | null;
  setUser: (user: { role?: string } | null) => void;
  isManager: () => boolean;
  isCashier: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ role?: string } | null>(null);

  const isManager = () => user?.role === "manager";
  const isCashier = () => user?.role === "cashier";

  return (
    <UserContext.Provider value={{ user, setUser, isManager, isCashier }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
