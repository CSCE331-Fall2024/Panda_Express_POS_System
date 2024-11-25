import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  role: 'customer' | 'cashier' | 'manager' | null;
}

interface UserContextProps {
  user: User;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>({ role: null });

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
