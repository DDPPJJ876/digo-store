import type Stripe from "stripe";
import { getSupabaseAdminClient } from "./supabase";
import { paidOrder } from "./checkout";

export async function recordPaidOrder(session: Stripe.Checkout.Session) {
  const order = paidOrder(session);
  if (!order) return false;
  const { error } = await getSupabaseAdminClient().from("orders").upsert(order, {
    onConflict: "stripe_session_id", ignoreDuplicates: true
  });
  if (error) throw new Error("Order storage failed.");
  return true;
}
