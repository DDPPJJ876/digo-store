import Link from "next/link";

export default function CheckoutCancelPage() {
  return (
    <main className="shell">
      <section className="panel">
        <h1>Checkout canceled</h1>
        <p className="muted">No payment was taken.</p>
        <Link className="button primary" href="/">
          Back to store
        </Link>
      </section>
    </main>
  );
}
