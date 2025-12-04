import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (amount, currency = 'pln') => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency,
        automatic_payment_methods: {
            enabled: true,
        },
    });
    return paymentIntent;
};

export const retrievePaymentIntent = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        return paymentIntent;
    } catch (error) {
        throw new Error("Payment intent retrieval failed");
    }
};

export const verifyPayment = async (paymentIntentId) => {
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        
        if (paymentIntent.status === 'succeeded') {
            return {
                verified: true,
                details: {
                    id: paymentIntent.id,
                    status: paymentIntent.status,
                    email_address: paymentIntent.receipt_email
                }
            };
        } else {
            return { verified: false };
        }
    } catch (error) {
        return { verified: false, error: error.message };
    }
};