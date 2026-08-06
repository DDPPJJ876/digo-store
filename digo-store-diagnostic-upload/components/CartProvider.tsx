"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { DIGO_HERO } from "@/lib/digo-hero";
import { formatMoney } from "@/lib/money";
import type { CartItem, CartOptions, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product, options?: CartOptions) => void;
  changeQuantity: (lineKey: string, delta: number) => void;
  removeItem: (lineKey: string) => void;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.product.price_cents * item.quantity, 0);

    return {
      items,
      count,
      total,
      addItem(product, options = {}) {
        const lineKey = [product.id, options.color ?? "", options.size ?? ""].join(":");
        setItems((current) => {
          const existing = current.find((item) => item.lineKey === lineKey);
          if (existing) {
            return current.map((item) => item.lineKey === lineKey ? { ...item, quantity: item.quantity + 1 } : item);
          }
          return [...current, { lineKey, product, quantity: 1, options }];
        });
        setOpen(true);
      },
      changeQuantity(lineKey, delta) {
        setItems((current) => current
          .map((item) => item.lineKey === lineKey ? { ...item, quantity: item.quantity + delta } : item)
          .filter((item) => item.quantity > 0));
      },
      removeItem(lineKey) {
        setItems((current) => current.filter((item) => item.lineKey !== lineKey));
      },
      setOpen
    };
  }, [items]);

  async function checkout() {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.product.id,
            quantity: item.quantity,
            size: item.options.size,
            color: item.options.color
          }))
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        alert(payload.error ?? "Checkout failed.");
        return;
      }
      window.location.href = payload.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <CartContext.Provider value={value}>
      {children}
      <div className={open ? "digo-cart-backdrop visible" : "digo-cart-backdrop"} onClick={() => setOpen(false)} />
      <aside className={open ? "digo-cart-drawer open" : "digo-cart-drawer"} aria-hidden={!open} aria-label="Shopping bag">
        <div className="digo-cart-head">
          <p>Bag / {String(value.count).padStart(2, "0")}</p>
          <button onClick={() => setOpen(false)} aria-label="Close bag">×</button>
        </div>
        {items.length === 0 ? (
          <div className="digo-empty-bag">
            <p>Your first form is waiting.</p>
            <button onClick={() => setOpen(false)}>Continue exploring</button>
          </div>
        ) : (
          <>
            <div className="digo-cart-list">
              {items.map((item) => (
                <article className="digo-cart-item" key={item.lineKey}>
                  <img src={item.product.image_url || DIGO_HERO} alt="" />
                  <div>
                    <h3>{item.product.name}</h3>
                    <p>{[item.options.color, item.options.size].filter(Boolean).join(" / ") || "Standard"}</p>
                    <div className="digo-quantity-control">
                      <button onClick={() => value.changeQuantity(item.lineKey, -1)} aria-label="Decrease quantity">−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => value.changeQuantity(item.lineKey, 1)} aria-label="Increase quantity">+</button>
                    </div>
                    <button className="digo-remove" onClick={() => value.removeItem(item.lineKey)}>Remove</button>
                  </div>
                  <b>{formatMoney(item.product.price_cents * item.quantity, item.product.currency)}</b>
                </article>
              ))}
            </div>
            <div className="digo-cart-total">
              <div><span>Subtotal</span><b>{formatMoney(value.total)}</b></div>
              <p>Shipping and duties calculated at checkout.</p>
              <button onClick={checkout} disabled={loading}>
                {loading ? "Preparing checkout" : "Secure checkout"}<span>↗</span>
              </button>
            </div>
          </>
        )}
      </aside>
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider.");
  return value;
}
