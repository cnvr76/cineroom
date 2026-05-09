import z from "zod";

export const loginSchema = z.object({
  email: z.email("Incorrect email format"),
  password: z.string().min(6, "Password is too short (min 6)"),
});
export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = loginSchema.extend({
  username: z.string().min(2, "Username is too short (min 2)"),
});
export type SignupFormData = z.infer<typeof signupSchema>;
