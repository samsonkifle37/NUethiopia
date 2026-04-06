/**
 * NU Ethiopia Payment Orchestrator
 * Routes payments to the correct provider based on region and currency.
 */

import { PaymentMethod, PaymentCurrency, PaymentIntent, PaymentProvider } from "./types";

class TelebirrAdapter implements PaymentProvider {
    name = "Telebirr";
    
    async createIntent(amount: number, currency: PaymentCurrency, metadata: any): Promise<PaymentIntent> {
        // Implement Telebirr API call (H5 redirect flow)
        // TELEBIRR_API_URL + sign(params)
        console.log(`[Telebirr] Creating intent for ${amount} ${currency}`);
        
        return {
            id: `tele_${Math.random().toString(36).substr(2, 9)}`,
            amount,
            currency,
            method: "telebirr",
            status: "INITIATED",
            checkoutUrl: "https://shop.telebirr.et/?..." // Placeholder
        };
    }

    async verifyPayment(intentId: string): Promise<boolean> {
        console.log(`[Telebirr] Verifying intent ${intentId}`);
        return true; // Implement actual verification with Telebirr callback
    }
}

class StripeAdapter implements PaymentProvider {
    name = "Stripe";
    
    async createIntent(amount: number, currency: PaymentCurrency, metadata: any): Promise<PaymentIntent> {
        console.log(`[Stripe] Creating intent for ${amount} ${currency}`);
        
        return {
            id: `strp_${Math.random().toString(36).substr(2, 9)}`,
            amount,
            currency,
            method: "stripe",
            status: "INITIATED",
            checkoutUrl: "/api/pay/stripe/checkout" // Local API proxy to Stripe
        };
    }

    async verifyPayment(intentId: string): Promise<boolean> {
        return true;
    }
}

export class PaymentOrchestrator {
    private static providers: Record<PaymentMethod, PaymentProvider> = {
        telebirr: new TelebirrAdapter(),
        stripe: new StripeAdapter(),
        cbe_birr: new TelebirrAdapter(), // Placeholder for CBE Birr
        paypal: new StripeAdapter(), // Placeholder
        cash: new TelebirrAdapter(), // Placeholder
    };

    static getAvailableMethods(currency: PaymentCurrency): PaymentMethod[] {
        if (currency === "ETB") return ["telebirr", "cbe_birr", "cash"];
        return ["stripe", "paypal"];
    }

    static async startPayment(method: PaymentMethod, amount: number, currency: PaymentCurrency, metadata: any): Promise<PaymentIntent> {
        const provider = this.providers[method];
        if (!provider) throw new Error(`Unsupported payment method: ${method}`);
        
        return await provider.createIntent(amount, currency, metadata);
    }
}
