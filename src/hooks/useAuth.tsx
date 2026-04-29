import { useState, useEffect, createContext, useContext, type ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem("auth") === "true";
  });

  const login = (password: string) => {
    const valid = password === import.meta.env.VITE_ADMIN_PASSWORD;
    if (valid) {
      sessionStorage.setItem("auth", "true");
      setIsAuthenticated(true);
    }
    return valid;
  };

  const logout = () => {
    sessionStorage.removeItem("auth");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
