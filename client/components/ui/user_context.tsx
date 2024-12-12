/**
 * Represents a user context component.
 * 
 * @remarks
 * This component provides a user context with user information and roles.
 * 
 * @returns {JSX.Element} The rendered user context component.
 */
import { FC, createContext, ReactNode, useContext, useState } from "react";

interface UserContextType {
  user: { 
    id?: number; 
    role?: string 
  } | null;
  setUser: (user: { 
    id?: number; 
    role?: string 
  } | null) => void;
  isManager: () => boolean;
  isCashier: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

/** 
 * Provider component that wraps the application with user context
 * 
 * @remarks
 * This component provides information regarding the staff using the POS system. 
 * Information provided includes details of their respective roles and their uniquely
 * assigned staff id.
 * 
 * @returns {JSX.Element} - User context provider with user state and methods
 */
export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ 
    id?: number; 
    role?: string 
  } | null>(null);

  const isManager = () => user?.role === "manager";
  const isCashier = () => user?.role === "cashier";

  return (
    <UserContext.Provider value={{ user, setUser, isManager, isCashier }}>
      {children}
    </UserContext.Provider>
  );
};

/** 
 * Custom hook to access user context in child components
 * 
 * @throws {Error} - If used outside of a UserProvider
 * @returns {UserContextType} - The user context with user state and methods
 */

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};