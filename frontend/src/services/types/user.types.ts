import z from "zod";

export type RolesType = "user" | "admin";

export interface IUser {
  id: string;
  username: string;
  email: string;
  role: RolesType;
  avatarUrl?: string;
}

export interface IUserFull extends IUser {
  favoriteCount: number;
  moviesCount: number;
  tvCount: number;
  joinedAt: string;
}

export const meSchema = z.object({
  username: z
    .string()
    .min(2, "Username is too short to change (min 2)")
    .optional(),
});
export type ChangeMeFormData = z.infer<typeof meSchema>;

export const userSchema = meSchema.extend({
  role: z
    .enum(["user", "admin"], {
      error: () => ({ message: "Invalid role" }),
    })
    .optional(),
});
export type ChangeUserFormData = z.infer<typeof userSchema>;
