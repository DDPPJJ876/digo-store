"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Clock3, Package, ArrowRight, RotateCcw } from "lucide-react";
import { formatMoney } from "@/lib/money";
import { purchaseLabel, type ReservationPlan } from "@/lib/purchase";

export function ReservationPreview({ deposit, balance, plan, quantity }: { deposit: number; balance: number; plan: ReservationPlan; quantity: number }) {
  const [stage, setStage] = useState<"queued" | "ready" | "paid" | "cancelled">("queued");
  const ready = stage === "ready";
  return <section className="reservation-preview">
    <div className="preview-topline"><span className="preview-pill">INTERACTIVE PREVIEW</span><button className="text-link" onClick={() => setStage("queued")}><RotateCcw size={13}/>Reset</button></div>
    <p className="context-note">No money is charged. No order, stock allocation or refund is created.</p>
    {stage !== "cancelled" && <ol className="order-stepper"><li className="done"><Check size={14}/><span>Deposit</span></li><li className={stage === "queued" ? "current" : "done"}><span>02</span>Stock</li><li className={ready ? "current" : stage === "paid" ? "done" : ""}><span>03</span>Balance</li><li className={stage === "paid" ? "current" : ""}><span>04</span>Dispatch</li></ol>}
    <div className="preview-status" aria-live="polite"><span className="status-icon">{stage === "queued" ? <Clock3/> : stage === "cancelled" ? <RotateCcw/> : <Package/>}</span>
      <span className="small-label">{purchaseLabel("reservation",plan)}</span>
      <h2>{stage === "queued" ? "You’re in the queue." : ready ? "Your pieces are ready." : stage === "paid" ? "Next stop: your wardrobe." : "Reservation cancelled."}</h2>
      <p>{stage === "queued" ? "After your deposit is confirmed, this is where you’ll see your reservation. When stock is available, you can pay the remaining balance." : ready ? "Stock has been confirmed in this example. Review the delivery details, then pay the balance to prepare your order for dispatch." : stage === "paid" ? "The example balance is paid. Your order is awaiting dispatch; it is not marked as shipped until a shipment is recorded." : "In this example, option A is cancelled before the balance is paid. The deposit refund is pending processing."}</p>
    </div>
    <div className="preview-amounts"><div><span>{quantity} reserved {quantity === 1 ? "piece" : "pieces"}</span><strong>{formatMoney(deposit+balance)}</strong></div><div><span>Deposit paid · example</span><strong>− {formatMoney(deposit)}</strong></div>{stage === "paid" && <div><span>Balance paid · example</span><strong>− {formatMoney(balance)}</strong></div>}<div className="preview-balance"><span>{stage === "paid" ? "Balance outstanding" : stage === "cancelled" ? "Deposit refund pending" : "Remaining product balance"}</span><strong>{formatMoney(stage === "paid" ? 0 : stage === "cancelled" ? deposit : balance)}</strong></div></div>
    {ready && <p className="notice-banner">Preview only: delivery window, shipping and tax must be confirmed in a real balance checkout. The amount above is the product balance.</p>}
    {stage === "queued" && <><button className="editorial-button add-selection" onClick={() => setStage("ready")}>Preview: stock becomes available <ArrowRight size={16}/></button>{plan === "refundable" ? <button className="preview-cancel" onClick={() => setStage("cancelled")}>Preview: cancel and request deposit refund</button> : <p className="context-note">A change of mind does not qualify for a deposit refund under option B. Digo’s inability to supply and applicable consumer rights are exceptions.</p>}</>}
    {ready && <button className="editorial-button add-selection" onClick={() => setStage("paid")}>Preview: pay balance · {formatMoney(balance)} <ArrowRight size={16}/></button>}
    {(stage === "paid" || stage === "cancelled") && <Link href="/" className="editorial-button add-selection">Back to the edit <ArrowRight size={16}/></Link>}
  </section>;
}
