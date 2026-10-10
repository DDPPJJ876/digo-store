import Link from "next/link";
import { RESERVATION_TERMS_VERSION } from "@/lib/purchase";

export default function ReservationTermsPage() {
  return <main className="transaction-shell terms-shell"><Link className="text-link" href="/checkout">← Back to your bag</Link>
    <span className="small-label">DIGO · RESERVATIONS</span><h1>A little clarity before you commit.</h1>
    <p className="notice-banner">Preview terms · Real payments are closed. These options describe the proposed flow for testing; final terms will be published before paid reservations open.</p>
    <section><h2>A · Refundable reservation</h2><p>Your deposit is credited toward the product price. You may cancel for a deposit refund before paying the balance. Terms for returns after full payment will be shown before that payment.</p></section>
    <section><h2>B · Non-refundable reservation</h2><p>Your confirmed deposit places you in the procurement queue and is credited toward the product price. The deposit is not refundable if you simply change your mind after payment.</p><p>If Digo cannot supply the agreed item, the deposit is refundable under either option. This does not limit applicable consumer rights. Selecting B does not promise a discount, priority or delivery date.</p></section>
    <section><h2>What happens next</h2><ol><li>Review the pieces, reservation type and deposit before entering Stripe checkout.</li><li>A reservation joins the queue only after payment is verified and the order is recorded.</li><li>Once stock is confirmed, review the exact pieces, delivery window, shipping, tax and remaining balance.</li><li>Choose to pay the balance in a separate checkout. Digo does not automatically debit it. Dispatch follows confirmed payment and fulfilment checks.</li></ol><p>If stock is already available, this flow can move directly from confirmed deposit to balance review. No second deposit is required.</p></section>
    <section><h2>Before real reservations open</h2><p>Digo will publish the merchant identity, customer support contact, reservation deadline, delivery commitment, cancellation method and refund timing. The current preview does not create a paid reservation, allocate stock or request a refund.</p></section>
    <p className="context-note">Version: {RESERVATION_TERMS_VERSION}</p>
  </main>;
}
