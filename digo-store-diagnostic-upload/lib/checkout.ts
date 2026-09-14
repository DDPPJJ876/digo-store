import type Stripe from "stripe";
import type { Product } from "./types";

export type PurchaseKind = "retail" | "reservation";
export type CheckoutItem = { id: string; quantity: number; kind: PurchaseKind };
export class CheckoutInputError extends Error {}

export function parseCheckoutItems(value: unknown): CheckoutItem[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    throw new CheckoutInputError("Choose between 1 and 20 items.");
  }
  const items = new Map<string, CheckoutItem>();
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object") throw new CheckoutInputError("Invalid cart item.");
    const { id, quantity, kind = "retail" } = candidate;
    if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(id) ||
        !Number.isInteger(quantity) || quantity < 1 || quantity > 99 ||
        (kind !== "retail" && kind !== "reservation")) {
      throw new CheckoutInputError("Invalid product, quantity, or purchase type.");
    }
    const key = `${id}:${kind}`;
    const total = (items.get(key)?.quantity ?? 0) + quantity;
    if (total > 99) throw new CheckoutInputError("Maximum 99 of each item.");
    items.set(key, { id, quantity: total, kind });
  }
  return [...items.values()];
}

export function buildCheckout(items: CheckoutItem[], products: Product[]) {
  const metadata: Record<string, string> = { digo_checkout: "v2" };
  const currencies = new Set<string>();
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item, index) => {
    const product = products.find((p) => p.id === item.id && p.active);
    if (!product) throw new CheckoutInputError("A selected product is no longer available.");
    const unitAmount = item.kind === "reservation" ? product.reserve_price_cents : product.price_cents;
    if (!Number.isSafeInteger(unitAmount) || (unitAmount ?? 0) <= 0 || (unitAmount ?? 0) > 1000000) {
      throw new CheckoutInputError("This product is not available for this purchase type.");
    }
    const currency = product.currency.toLowerCase();
    if (currency !== "usd") throw new CheckoutInputError("Checkout currently supports USD only.");
    currencies.add(currency);
    // Each metadata value stays below Stripe's 500-character limit.
    metadata[`item_${index}`] = JSON.stringify({ id: product.id, quantity: item.quantity,
      kind: item.kind, unit_amount: unitAmount, retail_unit_amount: product.price_cents });
    return {
      quantity: item.quantity,
      price_data: {
        currency,
        unit_amount: unitAmount!,
        product_data: {
          name: `${item.kind === "reservation" ? "Reservation deposit — " : ""}${product.name}`,
          description: item.kind === "reservation"
            ? "Deposit only. The remaining product balance is not charged today."
            : product.description?.slice(0, 500) || undefined,
          metadata: { product_id: product.id, purchase_kind: item.kind }
        }
      }
    };
  });
  if (currencies.size !== 1) throw new CheckoutInputError("Use a single currency per checkout.");
  return { line_items, metadata, hasRetail: items.some((item) => item.kind === "retail") };
}

export function paidOrder(session: Stripe.Checkout.Session) {
  if (session.metadata?.digo_checkout !== "v2" || session.payment_status !== "paid") return null;
  return {
    stripe_session_id: session.id,
    customer_email: session.customer_details?.email ?? null,
    amount_total: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    status: "paid",
    metadata: { ...session.metadata, livemode: session.livemode,
      payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      shipping_details: session.shipping_details ?? null }
  };
}
