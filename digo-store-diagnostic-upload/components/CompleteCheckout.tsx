"use client";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { CART_STORAGE_KEY, ATTEMPT_STORAGE_KEY } from "@/lib/purchase";
export function CompleteCheckout({ fingerprint }: { fingerprint: string }) {
  const { clearCart } = useCart();
  useEffect(() => {
    try {
      const attempt = JSON.parse(sessionStorage.getItem(ATTEMPT_STORAGE_KEY) ?? "null");
      const current = JSON.parse(sessionStorage.getItem(CART_STORAGE_KEY) ?? "[]");
      const currentFingerprint = JSON.stringify(current.map((item: {product: {id: string}; quantity: number; kind: string; reservationPlan?: string}) =>
        ({id: item.product.id, quantity: item.quantity, kind: item.kind, ...(item.kind === "reservation" ? {reservationPlan: item.reservationPlan} : {})})));
      if (attempt?.fingerprint === fingerprint && currentFingerprint === fingerprint) {
        sessionStorage.removeItem(ATTEMPT_STORAGE_KEY);
        sessionStorage.setItem(CART_STORAGE_KEY, "[]");
        clearCart();
      }
    } catch {}
  }, [fingerprint, clearCart]);
  return null;
}
