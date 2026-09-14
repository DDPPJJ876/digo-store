import Link from "next/link";
export default function CheckoutCancelPage() {
  return <main className="shell"><section className="panel" style={{ marginTop: 40 }}>
    <h1>Checkout cancelled</h1><p>Your cart is saved. You can review it and try again.</p>
    <Link className="button primary" href="/checkout">Return to checkout</Link>
  </section></main>;
}
