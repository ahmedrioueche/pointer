import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const { paymentMethodId, amountInDollars } = await request.json();
    if (!paymentMethodId || !amountInDollars) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const amount = Math.round(amountInDollars * 100);

    // Create the payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirm: true, 
      return_url: "https://localhost:3000/main/success"
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: 'Use POST to create a payment intent' }, { status: 405 });
}
