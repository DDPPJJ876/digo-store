"use client";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { formatMoney } from "@/lib/money";
import type { CartItem, Product } from "@/lib/types";
import type { PurchaseKind } from "@/lib/checkout";

const storageKey = "digo-cart-v2";
const attemptKey = "digo-checkout-attempt-v2";
type CartContextValue = {
  items: CartItem[]; count: number; total: number; busy: boolean; error: string; available: boolean; testMode: boolean | null;
  addItem: (product: Product, kind?: PurchaseKind) => void;
  removeItem: (productId: string, kind?: PurchaseKind) => void;
  clearCart: () => void;
  setOpen: (open: boolean) => void; checkout: () => Promise<void>;
};
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState(false);
  const [testMode, setTestMode] = useState<boolean | null>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/checkout", { signal: controller.signal }).then((r) => r.json()).then((data) => {
      setAvailable(data.available === true); setTestMode(data.testMode === true);
    }).catch(() => {});
    return () => controller.abort();
  }, []);
  useEffect(() => {
    try {
      const stored = JSON.parse(sessionStorage.getItem(storageKey) ?? "[]");
      if (Array.isArray(stored)) setItems(stored.filter((item) => item?.product &&
        typeof item.product.id === "string" && typeof item.product.name === "string" &&
        Number.isSafeInteger(item.product.price_cents) && item.product.price_cents > 0 &&
        Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99 &&
        (item.kind === "retail" || (item.kind === "reservation" && Number.isSafeInteger(item.product.reserve_price_cents) && item.product.reserve_price_cents > 0))).slice(0,20));
    } catch { /* Storage can be unavailable in private browsing. */ }
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) try { sessionStorage.setItem(storageKey, JSON.stringify(items)); } catch {}
  }, [items, ready]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => sum + (item.kind === "reservation" ? item.product.reserve_price_cents! : item.product.price_cents) * item.quantity, 0);
  function addItem(product: Product, kind: PurchaseKind = "retail") {
    setError("");
    setItems((current) => {
      const existing = current.find((item) => item.product.id === product.id && item.kind === kind);
      if (existing) return current.map((item) => item === existing ? { ...item, quantity: Math.min(99, item.quantity + 1) } : item);
      if (current.length >= 20) return current;
      return [...current, { product, quantity: 1, kind }];
    });
    setOpen(true);
  }
  function removeItem(id: string, kind: PurchaseKind = "retail") {
    setError("");
    setItems((current) => current.map((item) => item.product.id === id && item.kind === kind
      ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0));
  }
  async function checkout() {
    if (inFlight.current || !items.length) return;
    inFlight.current = true; setBusy(true); setError("");
    const payloadItems = items.map(({ product, quantity, kind }) => ({ id: product.id, quantity, kind }));
    const fingerprint = JSON.stringify(payloadItems);
    let requestId: string = crypto.randomUUID();
    try {
      const previous = JSON.parse(sessionStorage.getItem(attemptKey) ?? "null");
      if (previous?.fingerprint === fingerprint && typeof previous.requestId === "string") requestId = previous.requestId;
      sessionStorage.setItem(attemptKey, JSON.stringify({ fingerprint, requestId }));
    } catch {}
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payloadItems, requestId }) });
      const payload = await response.json();
      if (!response.ok) {
        if (response.status === 400) try { sessionStorage.removeItem(attemptKey); } catch {}
        throw new Error(payload.error ?? "Checkout failed. Please try again.");
      }
      const target = new URL(payload.url);
      if (target.protocol !== "https:" || target.hostname !== "checkout.stripe.com") throw new Error("Invalid checkout address.");
      window.location.assign(target.href);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to open payment. Please try again."); }
    finally { inFlight.current = false; setBusy(false); }
  }
  function clearCart() { setItems([]); }
  const value = { clearCart, items, count, total, busy, error, available, testMode, addItem, removeItem, setOpen, checkout };
  return <CartContext.Provider value={value}>
    {children}
    {open && <><div className="overlay" onClick={() => setOpen(false)} />
      <aside className="cart-drawer" aria-label="Shopping cart">
        <div className="cart-head cart-row"><strong>Cart</strong><button className="icon-button" aria-label="Close cart" onClick={() => setOpen(false)}><X size={18} /></button></div>
        <div className="cart-list">{!items.length ? <p className="muted">Your cart is empty.</p> : items.map((item) =>
          <div className="cart-item" key={`${item.product.id}:${item.kind}`}>
            <div className="cart-row"><strong>{item.product.name}</strong><button className="icon-button" onClick={() => removeItem(item.product.id, item.kind)} aria-label={`Remove ${item.product.name}`}><Trash2 size={16} /></button></div>
            <p className="muted">{item.kind === "reservation" ? "Reservation deposit" : "Full product price"}</p>
            <div className="cart-row muted"><span>Qty {item.quantity}</span><span>{formatMoney((item.kind === "reservation" ? item.product.reserve_price_cents! : item.product.price_cents) * item.quantity)}</span></div>
          </div>)}</div>
        <div className="cart-foot"><div className="cart-row"><strong>Due today</strong><strong>{formatMoney(total)}</strong></div>
          <Link className="button primary" href="/checkout" onClick={() => setOpen(false)} style={{ marginTop: 14, width: "100%" }}><ShoppingBag size={18} />Review checkout</Link>
        </div>
      </aside></>}
  </CartContext.Provider>;
}
export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider.");
  return value;
}
