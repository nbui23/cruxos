import { z } from 'zod';

export const registerPayloadSchema = z.object({
  name: z.string().trim().max(80).optional(),
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export const loginPayloadSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export type RegisterPayload = z.infer<typeof registerPayloadSchema>;
export type LoginPayload = z.infer<typeof loginPayloadSchema>;
