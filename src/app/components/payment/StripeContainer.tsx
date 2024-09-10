    "use client"
    import React from 'react';
    import { Elements } from '@stripe/react-stripe-js';
    import { loadStripe } from '@stripe/stripe-js';

    console.log("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

    const StripeContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <Elements stripe={stripePromise}>{children}</Elements>;
    };

    export default StripeContainer;
