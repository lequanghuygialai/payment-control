import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(4).max(12),
  password: z.string().min(4).max(12),
});

export const signUpSchema = loginSchema.extend({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;