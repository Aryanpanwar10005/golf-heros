import { NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay/helpers';
import { supabase } from '@/lib/supabase/client'; // Use service role for webhooks in production

/**
 * app/api/webhooks/razorpay/route.ts
 * Processes incoming Razorpay webhooks for subscription updates.
 */

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-razorpay-signature') || '';
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

  // 1. Verify Signature
  const isValid = verifyRazorpaySignature(body, signature, secret);
  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(body);

  // 2. Handle Events
  switch (event.event) {
    case 'subscription.activated':
    case 'subscription.charged':
      // Update subscription status in Supabase
      const subId = event.payload.subscription.entity.id;
      const userId = event.payload.subscription.entity.notes.userId;
      
      // Note: In a real app, use the Supabase Admin/Service Role client here
      // to bypass RLS for background updates.
      console.log(`Subscription ${subId} active for user ${userId}`);
      break;

    case 'subscription.cancelled':
    case 'subscription.halted':
      console.log(`Subscription ${event.payload.subscription.entity.id} inactive`);
      break;
  }

  return NextResponse.json({ received: true });
}
