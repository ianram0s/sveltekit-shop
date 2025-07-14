
import { z } from 'zod/v4';
import { parse, isValid } from 'date-fns';

export const profileFormSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.email({ message: 'Please enter a valid email' }),
    phone: z.string().optional().refine((v) => {
        if (!v) return true;
        return /^\+?[\d\s-()]+$/.test(v);
    }, { message: 'Please enter a valid phone number' }),
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
        message: "Please enter a valid date of birth."
    }),
})

export const addressFormSchema = z.object({
    street: z.string().min(1, { message: 'Street address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
    zipCode: z.string().min(1, { message: 'ZIP code is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
    isDefault: z.boolean().optional().default(false),
    label: z.string().optional().nullable()
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;
export type AddressFormInput = z.infer<typeof addressFormSchema>;