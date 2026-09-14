import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { recordPaidOrder } from "@/lib/orders";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  let stripe: Stripe;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  try {
    stripe = getStripe();
    if (!secret) throw new Error("Missing webhook secret.");
  } catch { return NextResponse.json({ error: "Payment service is not configured." }, { status: 503 }); }
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(await request.text(), signature, secret); }
  catch { return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 }); }
  if (event.livemode !== ((process.env.STRIPE_MODE ?? "test") === "live")) {
    return NextResponse.json({ error: "Payment mode mismatch." }, { status: 400 });
  }
  try {
    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await recordPaidOrder(event.data.object as Stripe.Checkout.Session);
    }
    // Unpaid/completed and async-failed sessions must never become paid orders.
    return NextResponse.json({ received: true });
  } catch {
    // A non-2xx response asks Stripe to retry; never acknowledge a lost order.
    console.error("DIGO paid order could not be stored; webhook retry required.");
    return NextResponse.json({ error: "Order storage temporarily unavailable." }, { status: 500 });
  }
}
