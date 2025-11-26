import { loadStripe, type Stripe } from "@stripe/stripe-js";

// export const stripePromise: Promise<StripeJs | null> = loadStripe(
//   import.meta.env.VITE_STRIPE_PUBLIC_KEY!
// );

let stripePromise: Promise<Stripe | null> | null = null;


export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env?.VITE_STRIPE_PUBLIC_KEY || "";

    if (!publishableKey) {
      console.error(
        "Stripe publishable key not found. Make sure to set STRIPE_PUBLISHABLE_KEY in your .env file"
      );
      return Promise.resolve(null);
    }

    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};