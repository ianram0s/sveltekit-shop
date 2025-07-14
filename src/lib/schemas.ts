
import { z } from 'zod/v4';
import { parse, isValid } from 'date-fns';

export const profileFormSchema = z.object({
    name: z.string().min(1, { error: 'Name is required' }),
    email: z.email({ error: 'Please enter a valid email' }),
    phone: z.string().optional().refine((v) => {
        if (!v) return true;
        return /^\+?[\d\s-()]+$/.test(v);
    }, { error: 'Please enter a valid phone number' }),
    dateOfBirth: z.string().optional().refine((v) => {
        if (!v || v === '') return true;
        const date = parse(v, 'dd/MM/yyyy', new Date());
        if (!isValid(date)) return false;
        const now = new Date();
        if (date > now) return false;
        const minDate = new Date(now.getFullYear() - 150, now.getMonth(), now.getDate());
        if (date < minDate) return false;
        return true;
    }, {
        error: "Please enter a valid date of birth."
    }),
})

export const addressFormSchema = z.object({
    street: z.string().min(1, { error: 'Street address is required' }),
    city: z.string().min(1, { error: 'City is required' }),
    state: z.string().min(1, { error: 'State is required' }),
    zipCode: z.string().min(1, { error: 'ZIP code is required' }),
    country: z.string().min(1, { error: 'Country is required' }),
    isDefault: z.boolean().optional().default(false),
    label: z.string().optional().nullable()
});

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

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
export type AddressFormInput = z.infer<typeof addressFormSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;