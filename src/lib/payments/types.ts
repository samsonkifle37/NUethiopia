/**
 * NU Ethiopia Payment Types
 */

export type PaymentMethod = "telebirr" | "cbe_birr" | "stripe" | "paypal" | "cash";
export type PaymentCurrency = "ETB" | "USD" | "EUR" | "GBP";

export type PaymentStatus = 
    | "PENDING" 
    | "INITIATED" 
    | "AWAITING_CONFIRMATION" 
    | "PAID" 
    | "FAILED" 
    | "REFUNDED" 
    | "CANCELLED" 
    | "EXPIRED";

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: PaymentCurrency;
    method: PaymentMethod;
    status: PaymentStatus;
    metadata?: any;
    checkoutUrl?: string; // Redirect for Telebirr/Stripe
}

export interface PaymentProvider {
    name: string;
    createIntent: (amount: number, currency: PaymentCurrency, metadata: any) => Promise<PaymentIntent>;
    verifyPayment: (intentId: string) => Promise<boolean>;
}
