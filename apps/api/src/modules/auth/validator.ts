import { z } from "zod";

export const registerUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long"),

  lastName: z
    .string()
    .trim()
    .max(50, "Last name is too long")
    .optional(),

  email: z
    .email("Invalid email address")
    .trim(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(100, "Password is too long"),
});

export type RegisterUserSchema = z.infer<typeof registerUserSchema>;