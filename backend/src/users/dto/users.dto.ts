import z from 'zod';

export const meSchema = z.object({
  username: z
    .string()
    .min(2, 'Username is too short to change (min 2)')
    .optional(),
});
export type UpdateMeDTO = z.infer<typeof meSchema>;

export const userSchema = meSchema.extend({
  role: z
    .enum(['user', 'admin'], {
      error: () => ({ message: 'Invalid role' }),
    })
    .optional(),
});
export type UpdateUserDTO = z.infer<typeof userSchema>;
