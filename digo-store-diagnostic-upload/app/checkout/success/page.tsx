import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main className="shell">
      <section className="panel">
        <h1>Payment received</h1>
        <p className="muted">
          Your order was placed successfully. Stripe will send the receipt to the
          customer email address.
        </p>
        <Link className="button primary" href="/">
          Continue shopping
        </Link>
      </section>
    </main>
  );
}
