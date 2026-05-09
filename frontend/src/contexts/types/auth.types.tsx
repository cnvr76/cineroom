import type { IUser } from "../../services/types/user.types";

export interface AuthState {
  user?: IUser;
  isAdmin: boolean;
  isAuthenticated: boolean;
  setUser: (user: IUser | undefined) => void;
  logout: () => void;
}
