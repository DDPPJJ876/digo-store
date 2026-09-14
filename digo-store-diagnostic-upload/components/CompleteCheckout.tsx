"use client";
import { useEffect } from "react";
import { useCart } from "./CartProvider";
export function CompleteCheckout({ fingerprint }: { fingerprint: string }) {
  const { clearCart } = useCart();
  useEffect(() => {
    try {
      const attempt = JSON.parse(sessionStorage.getItem("digo-checkout-attempt-v2") ?? "null");
      const current = JSON.parse(sessionStorage.getItem("digo-cart-v2") ?? "[]");
      const currentFingerprint = JSON.stringify(current.map((item: {product: {id: string}; quantity: number; kind: string}) =>
        ({id: item.product.id, quantity: item.quantity, kind: item.kind})));
      if (attempt?.fingerprint === fingerprint && currentFingerprint === fingerprint) {
        sessionStorage.removeItem("digo-checkout-attempt-v2");
        sessionStorage.setItem("digo-cart-v2", "[]");
        clearCart();
      }
    } catch {}
  }, [fingerprint, clearCart]);
  return null;
}
