import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import type { IUser } from "../services/types/user.types";
import { authService } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | undefined>(() => {
    const token = authService.getToken();
    if (!token) return undefined;
    try {
      return jwtDecode<IUser>(token);
    } catch {
      authService.removeToken();
      return undefined;
    }
  });
  const navigate = useNavigate();

  const setAccessToken = (access_token: string) => {
    const decoded = jwtDecode<IUser>(access_token);
    setUser(decoded);
    authService.saveToken(access_token);
  };

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
        isAuthenticated: !!user,
        setAccessToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
