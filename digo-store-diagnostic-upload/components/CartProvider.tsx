"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState
} from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { formatMoney } from "@/lib/money";
import type { CartItem, Product } from "@/lib/types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce(
      (sum, item) => sum + item.product.price_cents * item.quantity,
      0
    );

    return {
      items,
      count,
      total,
      addItem(product) {
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id);
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }

          return [...current, { product, quantity: 1 }];
        });
        setOpen(true);
      },
      removeItem(productId) {
        setItems((current) =>
          current
            .map((item) =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter((item) => item.quantity > 0)
        );
      },
      setOpen
    };
  }, [items]);

  async function checkout() {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({
          id: item.product.id,
          quantity: item.quantity
        }))
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      alert(payload.error ?? "Checkout failed.");
      return;
    }

    window.location.href = payload.url;
  }

  return (
    <CartContext.Provider value={value}>
      {children}
      {open ? <div className="overlay" onClick={() => setOpen(false)} /> : null}
      {open ? (
        <aside className="cart-drawer" aria-label="Shopping cart">
          <div className="cart-head cart-row">
            <strong>Cart</strong>
            <button className="icon-button" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          <div className="cart-list">
            {items.length === 0 ? (
              <p className="muted">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div className="cart-item" key={item.product.id}>
                  <div className="cart-row">
                    <strong>{item.product.name}</strong>
                    <button
                      className="icon-button"
                      onClick={() => value.removeItem(item.product.id)}
                      aria-label={`Remove ${item.product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="cart-row muted">
                    <span>Qty {item.quantity}</span>
                    <span>
                      {formatMoney(
                        item.product.price_cents * item.quantity,
                        item.product.currency
                      )}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="cart-foot">
            <div className="cart-row">
              <strong>Total</strong>
              <strong>{formatMoney(value.total)}</strong>
            </div>
            <button
              className="button primary"
              disabled={items.length === 0}
              onClick={checkout}
              style={{ marginTop: 14, width: "100%" }}
            >
              <ShoppingBag size={18} />
              Checkout
            </button>
          </div>
        </aside>
      ) : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) {
    throw new Error("useCart must be used inside CartProvider.");
  }

  return value;
}
