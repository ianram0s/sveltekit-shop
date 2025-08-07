import { z } from 'zod/v4';

export const customerFormSchema = z.object({
    firstName: z.string().min(1, { error: 'First name is required' }),
    lastName: z.string().min(1, { error: 'Last name is required' }),
    email: z.email({ error: 'Please enter a valid email address' }),
    phone: z.string().min(1, { error: 'Phone number is required' })
});

export const shippingFormSchema = z.object({
    address: z.string().min(1, { error: 'Address is required' }),
    city: z.string().min(1, { error: 'City is required' }),
    state: z.string().min(1, { error: 'State is required' }),
    zipCode: z.string().min(1, { error: 'ZIP code is required' }),
    country: z.string().default('US'),
    shippingMethod: z.enum(['standard', 'express', 'overnight']).default('standard')
});

export const paymentFormSchema = z.object({
    paymentMethod: z.literal('cash_on_delivery').default('cash_on_delivery')
});

export const reviewFormSchema = z.object({
    orderNotes: z.string().optional(),
    termsAccepted: z.boolean().refine(val => val === true, { error: 'You must accept the terms and conditions' })
});

export const checkoutFormSchema = z.object({
    customer: customerFormSchema,
    shipping: shippingFormSchema,
    payment: paymentFormSchema,
    review: reviewFormSchema
});

export type CustomerFormInput = z.infer<typeof customerFormSchema>;
export type ShippingFormInput = z.infer<typeof shippingFormSchema>;
export type PaymentFormInput = z.infer<typeof paymentFormSchema>;
export type ReviewFormInput = z.infer<typeof reviewFormSchema>;
export type CheckoutFormInput = z.infer<typeof checkoutFormSchema>; 