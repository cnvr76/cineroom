import type { IUser } from "../../services/types/user.types";

export interface AuthState {
  user?: IUser;
  isAdmin: boolean;
  isAuthenticated: boolean;
  setAccessToken: (access_token: string) => void;
  logout: () => void;
}
