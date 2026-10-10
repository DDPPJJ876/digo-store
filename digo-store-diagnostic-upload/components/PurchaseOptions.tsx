"use client";
import Link from "next/link";
import { useId } from "react";
import { ArrowRight, RotateCcw, Clock3 } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { reservationDescription, type PurchaseKind, type ReservationPlan } from "@/lib/purchase";

export function PurchaseOptions({ kind, plan, onKind, onPlan, total, deposit, currency = "usd", canReserve = true }: {
  kind: PurchaseKind; plan: ReservationPlan; onKind: (kind: PurchaseKind) => void;
  onPlan: (plan: ReservationPlan) => void; total: number; deposit: number; currency?: string; canReserve?: boolean;
}) {
  const group = useId();
  return <section className="purchase-section">
    <div className="purchase-section-heading"><h2>How would you like it?</h2><span className="preview-pill">Preview terms</span></div>
    <div className="purchase-options purchase-mode" aria-label="Purchase type">
      <button className={kind === "reservation" ? "active" : ""} aria-pressed={kind === "reservation"} disabled={!canReserve} onClick={() => onKind("reservation")}>Reserve with a deposit</button>
      <button className={kind === "retail" ? "active" : ""} aria-pressed={kind === "retail"} onClick={() => onKind("retail")}>Pay in full</button>
    </div>
    {kind === "reservation" ? <>
      <fieldset className="reservation-choices"><legend>Choose your reservation</legend>
        {(["refundable", "committed"] as const).map(value => <label key={value} className={`reservation-choice ${plan === value ? "selected" : ""}`}>
          <input type="radio" name={group} value={value} checked={plan === value} onChange={() => onPlan(value)} />
          <span className="reservation-choice-copy"><span className="reservation-choice-title">{value === "refundable" ? <RotateCcw size={16}/> : <Clock3 size={16}/>}<strong>{value === "refundable" ? "A · Refundable" : "B · Non-refundable"}</strong><b>{formatMoney(deposit,currency)}</b></span>
            <span>{reservationDescription(value)}</span>
          </span>
        </label>)}
      </fieldset>
      <div className="deposit-breakdown"><div><span>Deposit today</span><strong>{formatMoney(deposit,currency)}</strong></div><div><span>Product balance later</span><strong>{formatMoney(Math.max(0,total-deposit),currency)}</strong></div></div>
      <p className="context-note">If Digo cannot supply your item, both options qualify for a deposit refund. Applicable consumer rights are unaffected. No automatic balance charge.</p>
      <div className="reservation-next"><Clock3 size={17}/><p><strong>After your deposit is confirmed</strong><span>You join the queue. Once your pieces are available, review the delivery details and pay the balance to prepare them for dispatch.</span></p></div>
      <Link href="/reservation-terms" className="text-link">Read reservation terms <ArrowRight size={14}/></Link>
    </> : <div className="reservation-next"><Clock3 size={18}/><p><strong>Full product price · {formatMoney(total,currency)}</strong><span>Stock and delivery are not yet confirmed. Full-price checkout is currently available for testing only.</span></p></div>}
    <p className="purchase-fineprint">Shipping, tax and delivery dates must be confirmed before a real order. Paid reservations are not open yet.</p>
  </section>;
}
