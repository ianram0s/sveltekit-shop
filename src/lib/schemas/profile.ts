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
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>; 