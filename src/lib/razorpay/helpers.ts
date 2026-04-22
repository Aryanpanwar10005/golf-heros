import { razorpay } from './client';
import crypto from 'crypto';

/**
 * lib/razorpay/helpers.ts
 * Helper functions for subscription lifecycle and webhook validation.
 */

export interface CreateSubscriptionParams {
  planId: string;
  totalCount: number; // e.g., 12 for a year
  userId: string;
}

/**
 * Creates a subscription in Razorpay.
 */
export async function createRazorpaySubscription({
  planId,
  totalCount,
  userId,
}: CreateSubscriptionParams) {
  return await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: totalCount,
    quantity: 1,
    customer_notify: 1,
    notes: {
      userId,
    },
  });
}

/**
 * Verifies the Razorpay webhook signature.
 */
export function verifyRazorpaySignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');
  
  return expectedSignature === signature;
}
