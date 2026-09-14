"use client";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";
import type { PurchaseKind } from "@/lib/checkout";
export function AddToCartButton({ product, kind = "retail" }: { product: Product; kind?: PurchaseKind }) {
  const { addItem } = useCart();
  return <button className="button primary" onClick={() => addItem(product, kind)}>
    {kind === "reservation" ? "Reserve this item" : "Add to cart"}
  </button>;
}
