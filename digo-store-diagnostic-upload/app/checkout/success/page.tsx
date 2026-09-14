import Link from "next/link";
import { CompleteCheckout } from "@/components/CompleteCheckout";
import { getStripe } from "@/lib/stripe";
import { recordPaidOrder } from "@/lib/orders";
import { formatMoney } from "@/lib/money";

export const dynamic = "force-dynamic";
export default async function CheckoutSuccessPage({ searchParams }: { searchParams: { session_id?: string } }) {
  const id = searchParams.session_id;
  let fingerprint = "";
  let paid = false;
  let saved = false;
  let total: number | null = null;
  let isTest = false;
  if (id && /^cs_(test_|live_)?[a-zA-Z0-9]+$/.test(id)) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(id);
      if (session.metadata?.digo_checkout === "v2" && session.livemode === ((process.env.STRIPE_MODE ?? "test") === "live")) {
        paid = session.payment_status === "paid";
        isTest = !session.livemode;
        total = session.amount_total;
        if (paid) {
          const metadata = session.metadata ?? {};
          fingerprint = JSON.stringify(Object.keys(metadata).filter((key) => /^item_\d+$/.test(key))
            .sort((a, b) => Number(a.slice(5)) - Number(b.slice(5))).map((key) => {
              const item = JSON.parse(metadata[key]);
              return { id: item.id, quantity: item.quantity, kind: item.kind };
            }));
          saved = await recordPaidOrder(session);
        }
      }
    } catch { /* The webhook retries order storage independently. */ }
  }
  return <main className="shell"><section className="panel" style={{ marginTop: 40 }}>
    {paid && fingerprint && <CompleteCheckout fingerprint={fingerprint} />}
    <h1>{paid ? (isTest ? "Test payment completed" : "Payment received") : "Payment not confirmed"}</h1>
    <p className="muted">{paid ? (saved ? "Your payment and order have been recorded." : "Your payment was received. Your order confirmation is still processing. Please refresh this page shortly; do not pay again.") : "We could not confirm a completed payment. If you just paid, refresh this page before starting another checkout."}</p>
    {paid && total !== null && <p>Total: {formatMoney(total)}</p>}
    {paid && isTest && <p>This was a test. No real money was charged.</p>}
    <Link className="button primary" href="/">Continue shopping</Link>
  </section></main>;
}
