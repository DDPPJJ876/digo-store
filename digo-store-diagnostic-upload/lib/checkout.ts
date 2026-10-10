import type Stripe from "stripe";
import type { Product } from "./types";
import { purchaseKey, purchaseLabel, RESERVATION_TERMS_VERSION, type PurchaseKind, type ReservationPlan } from "./purchase";

export type { PurchaseKind } from "./purchase";
export type CheckoutItem = { id: string; quantity: number; kind: PurchaseKind; reservationPlan?: ReservationPlan };
export class CheckoutInputError extends Error {}

export function parseCheckoutItems(value: unknown): CheckoutItem[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) {
    throw new CheckoutInputError("Choose between 1 and 20 items.");
  }
  const items = new Map<string, CheckoutItem>();
  for (const candidate of value) {
    if (!candidate || typeof candidate !== "object") throw new CheckoutInputError("Invalid cart item.");
    const { id, quantity, kind = "retail", reservationPlan } = candidate;
    if (typeof id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(id) ||
        !Number.isInteger(quantity) || quantity < 1 || quantity > 99 ||
        (kind !== "retail" && kind !== "reservation") ||
        (kind === "reservation" && reservationPlan !== "refundable" && reservationPlan !== "committed") ||
        (kind === "retail" && reservationPlan !== undefined)) {
      throw new CheckoutInputError("Invalid product, quantity, or purchase type.");
    }
    const key = purchaseKey(id, kind, reservationPlan);
    const total = (items.get(key)?.quantity ?? 0) + quantity;
    if (total > 99) throw new CheckoutInputError("Maximum 99 of each item.");
    items.set(key, { id, quantity: total, kind, ...(kind === "reservation" ? { reservationPlan } : {}) });
  }
  return [...items.values()];
}

export function buildCheckout(items: CheckoutItem[], products: Product[]) {
  const metadata: Record<string, string> = { digo_checkout: "v3" };
  if (items.some(item => item.kind === "reservation")) metadata.reservation_terms = RESERVATION_TERMS_VERSION;
  const currencies = new Set<string>();
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item, index) => {
    const product = products.find((p) => p.id === item.id && p.active);
    if (!product) throw new CheckoutInputError("A selected product is no longer available.");
    const unitAmount = item.kind === "reservation" ? product.reserve_price_cents : product.price_cents;
    if (!Number.isSafeInteger(unitAmount) || (unitAmount ?? 0) <= 0 || (unitAmount ?? 0) > 1000000) {
      throw new CheckoutInputError("This product is not available for this purchase type.");
    }
    if (item.kind === "reservation" && (unitAmount! >= product.price_cents ||
      (item.reservationPlan !== "refundable" && item.reservationPlan !== "committed"))) {
      throw new CheckoutInputError("Choose a valid reservation option for this product.");
    }
    const currency = product.currency.toLowerCase();
    if (currency !== "usd") throw new CheckoutInputError("Checkout currently supports USD only.");
    currencies.add(currency);
    // Each metadata value stays below Stripe's 500-character limit.
    metadata[`item_${index}`] = JSON.stringify({ id: product.id, quantity: item.quantity,
      kind: item.kind, ...(item.reservationPlan ? { reservationPlan: item.reservationPlan } : {}),
      unit_amount: unitAmount, retail_unit_amount: product.price_cents });
    return {
      quantity: item.quantity,
      price_data: {
        currency,
        unit_amount: unitAmount!,
        product_data: {
          name: `${item.kind === "reservation" ? purchaseLabel(item.kind, item.reservationPlan) + " — " : ""}${product.name}`,
          description: item.kind === "reservation"
            ? "Deposit only. The remaining product balance is not charged today."
            : product.description?.slice(0, 500) || undefined,
          metadata: { product_id: product.id, purchase_kind: item.kind,
            ...(item.reservationPlan ? { reservation_plan: item.reservationPlan } : {}) }
        }
      }
    };
  });
  if (currencies.size !== 1) throw new CheckoutInputError("Use a single currency per checkout.");
  return { line_items, metadata, hasRetail: items.some((item) => item.kind === "retail") };
}

export function paidOrder(session: Stripe.Checkout.Session) {
  if (!["v2", "v3"].includes(session.metadata?.digo_checkout ?? "") || session.payment_status !== "paid") return null;
  const reservations = reservationSummary(session.metadata);
  return {
    stripe_session_id: session.id,
    customer_email: session.customer_details?.email ?? null,
    amount_total: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    status: "paid",
    metadata: { ...session.metadata, livemode: session.livemode,
      fulfillment_state: reservations.length ? "queued" : "awaiting_stock_confirmation",
      payment_intent: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
      shipping_details: session.shipping_details ?? null }
  };
}

export function reservationSummary(metadata: Stripe.Metadata | null) {
  const result: { plan?: ReservationPlan; deposit: number; balance: number; quantity: number }[] = [];
  for (const [key, value] of Object.entries(metadata ?? {})) {
    if (!/^item_\d+$/.test(key)) continue;
    try {
      const item = JSON.parse(value);
      if (item.kind !== "reservation" || !Number.isSafeInteger(item.quantity) || item.quantity < 1 ||
          !Number.isSafeInteger(item.unit_amount) || item.unit_amount <= 0 ||
          !Number.isSafeInteger(item.retail_unit_amount) || item.retail_unit_amount <= item.unit_amount) continue;
      result.push({ plan: item.reservationPlan === "refundable" || item.reservationPlan === "committed" ? item.reservationPlan : undefined,
        quantity: item.quantity, deposit: item.unit_amount * item.quantity,
        balance: (item.retail_unit_amount - item.unit_amount) * item.quantity });
    } catch { /* Old or malformed snapshots cannot create a reservation summary. */ }
  }
  return result;
}
