import { createContext, useContext } from "react";
import type { AuthState } from "./types/auth.types";

export const AuthContext = createContext<AuthState>(null!);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useSceneState must be used within SceneProvider");
  return context;
};
