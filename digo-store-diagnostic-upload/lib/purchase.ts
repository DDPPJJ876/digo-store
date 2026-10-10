export type PurchaseKind = "retail" | "reservation";
export type ReservationPlan = "refundable" | "committed";
export const RESERVATION_TERMS_VERSION = "preview-2026-10-10";
export const CART_STORAGE_KEY = "digo-cart-v3";
export const ATTEMPT_STORAGE_KEY = "digo-checkout-attempt-v3";

export function purchaseLabel(kind: PurchaseKind, plan?: ReservationPlan) {
  if (kind === "retail") return "Pay in full";
  return plan === "committed" ? "B · Non-refundable reservation" : "A · Refundable reservation";
}

export function purchaseKey(id: string, kind: PurchaseKind, plan?: ReservationPlan) {
  return `${id}:${kind}:${kind === "reservation" ? plan : ""}`;
}

export function reservationDescription(plan: ReservationPlan) {
  return plan === "refundable"
    ? "Cancel for a deposit refund before paying the balance. Your deposit goes toward the product price."
    : "Join the procurement queue. The deposit is non-refundable for a change of mind after payment; it goes toward the product price.";
}
