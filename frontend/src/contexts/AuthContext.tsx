import { createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  logout: () => void;
  setIsAuthenticated: (value: boolean) => void;
  setRole: (role: string | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
