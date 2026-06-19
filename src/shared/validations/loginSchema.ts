import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, 'Email is required')
    .email('Please enter a valid work email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters long'),
  role: z.string().optional() // Optional during simulation select
});

export type LoginInput = z.infer<typeof loginSchema>;
export default loginSchema;
