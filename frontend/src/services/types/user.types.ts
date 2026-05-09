export type RolesType = "user" | "admin";

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: RolesType;
}
