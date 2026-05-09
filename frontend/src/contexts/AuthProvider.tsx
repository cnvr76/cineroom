import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { IUser } from "../services/types/user.types";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const navigate = useNavigate();

  const logout = () => {
    setUser(undefined);
    authService.removeToken();
    navigate("/auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.role === "admin",
        isAuthenticated: authService.getToken() !== null,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
