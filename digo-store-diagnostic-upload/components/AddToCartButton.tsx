"use client";

import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export function AddToCartButton({ product }: { product: Product }) {
  const cart = useCart();

  return (
    <button className="button primary" onClick={() => cart.addItem(product)}>
      <ShoppingCart size={18} />
      Add to cart
    </button>
  );
}
