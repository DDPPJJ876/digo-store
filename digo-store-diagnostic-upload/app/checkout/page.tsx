"use client";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { formatMoney } from "@/lib/money";

export default function CheckoutPage() {
  const cart = useCart();
  return <main className="shell"><section className="panel" style={{ maxWidth: 700, margin: "40px auto" }}>
    <p className="eyebrow">DIGO · SECURE CHECKOUT</p><h1>Review your order</h1>
    {cart.testMode === true && <p className="panel">Test checkout — no real money is charged.</p>}
    {!cart.available && <p role="status">Payments are being set up. Please check back shortly.</p>}
    {!cart.items.length ? <><p>Your cart is empty.</p><Link className="button" href="/">Browse products</Link></> : <>
      {cart.items.map(({ product, quantity, kind }) => <div className="cart-row" key={`${product.id}:${kind}`} style={{ padding: "16px 0", borderBottom: "1px solid #ddd" }}>
        <div><strong>{product.name}</strong><div className="muted">{kind === "reservation" ? "Reservation deposit" : "Full product price"} · Qty {quantity}</div></div>
        <strong>{formatMoney((kind === "reservation" ? product.reserve_price_cents! : product.price_cents) * quantity)}</strong>
      </div>)}
      <div className="cart-row" style={{ margin: "24px 0" }}><strong>Total due today</strong><strong>{formatMoney(cart.total)}</strong></div>
      <p className="muted">You will enter your payment details on Stripe's secure checkout page.</p>
      {cart.items.some((item) => item.kind === "reservation") && <p className="muted">Reservations charge only the deposit shown. The remaining product balance is not charged today.</p>}
      {cart.error && <p role="alert">{cart.error}</p>}
      <button className="button primary" disabled={cart.busy || !cart.available} onClick={cart.checkout}>{cart.busy ? "Opening secure checkout…" : `Pay ${formatMoney(cart.total)} with Stripe`}</button>
    </>}
  </section></main>;
}
