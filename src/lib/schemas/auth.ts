import { z } from 'zod/v4';

export const signInSchema = z.object({
    email: z.email({ error: 'Please enter a valid email' }).min(1, { error: 'Email is required' }),
    password: z.string().min(1, { error: 'Password is required' })
        .min(8, { error: 'Password must be at least 8 characters' })
});

export const signUpSchema = z.object({
    name: z.string().min(1, { error: 'Name is required' })
        .min(2, { error: 'Name must be at least 2 characters' })
        .max(100, { error: 'Name must be less than 100 characters' }),
    email: z.email({ error: 'Please enter a valid email' }).min(1, { error: 'Email is required' }),
    password: z.string().min(1, { error: 'Password is required' })
        .min(8, { error: 'Password must be at least 8 characters' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
            error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
        })
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>; 