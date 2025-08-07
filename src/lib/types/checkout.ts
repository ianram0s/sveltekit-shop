import type { CustomerFormInput, ShippingFormInput, PaymentFormInput, ReviewFormInput } from '@/schemas';

export interface CheckoutData {
    customer?: CustomerFormInput;
    shipping?: ShippingFormInput;
    payment?: PaymentFormInput;
    review?: ReviewFormInput;
}

export interface CheckoutValidationError {
    step: 'customer' | 'shipping' | 'payment' | 'review';
    message: string;
}