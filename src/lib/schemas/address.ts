import { z } from 'zod/v4';

export const addressFormSchema = z.object({
    street: z.string().min(1, { error: 'Street address is required' }),
    city: z.string().min(1, { error: 'City is required' }),
    state: z.string().min(1, { error: 'State is required' }),
    zipCode: z.string().min(1, { error: 'ZIP code is required' }),
    country: z.string().min(1, { error: 'Country is required' }),
    isDefault: z.boolean().optional().default(false),
    label: z.string().optional().nullable()
});

export type AddressFormInput = z.infer<typeof addressFormSchema>; 