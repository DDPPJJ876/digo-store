"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, CalendarDays, Check, ShoppingBag } from "lucide-react";
import type { Look } from "@/lib/looks";
import type { Product } from "@/lib/types";
import { formatMoney } from "@/lib/money";
import { LookPhoto } from "./LookPhoto";
import { useSavedLooks } from "./useSavedLooks";
import { useCart } from "./CartProvider";

type Slot = Look['slots'][number] & { products: Product[] };
export function LookBuilder({look, slots}: {look: Look; slots: Slot[]}) {
  const [chosen, setChosen] = useState(slots.map(s => s.products[0]?.id || ""));
  const [included, setIncluded] = useState(slots.map(s => s.products.length > 0));
  const [kind, setKind] = useState<"retail" | "reservation">("retail");
  const [message, setMessage] = useState("");
  const { saved, toggle, storageError } = useSavedLooks();
  const cart = useCart();
  const all = slots.flatMap((s,i) => {const p=s.products.find(p => p.id===chosen[i]); return p ? [p] : [];});
  const selected = slots.flatMap((s,i) => {const p=s.products.find(p => p.id===chosen[i]); return p && included[i] ? [p] : [];});
  const total = selected.reduce((n,p) => n+p.price_cents,0);
  const fullTotal = all.reduce((n,p) => n+p.price_cents,0);
  const depositsAvailable = selected.every(p => Number.isSafeInteger(p.reserve_price_cents) && p.reserve_price_cents! > 0);
  const deposit = selected.reduce((n,p) => n+(p.reserve_price_cents || 0),0);
  function addSelected() {
    const newLines=selected.filter(p => !cart.items.some(i => i.product.id===p.id && i.kind===kind));
    if (cart.items.length+newLines.length>20) {setMessage("Your bag can hold 20 different items. Please review it first.");return;}
    if (selected.some(p => cart.items.some(i => i.product.id===p.id && i.kind===kind && i.quantity>=99))) {setMessage("An item is already at the quantity limit. Please review your bag.");return;}
    selected.forEach(p => cart.addItem(p,kind));
    setMessage(`${selected.length} ${selected.length===1 ? "piece" : "pieces"} added to your bag.`);
  }
  return <main className="look-detail-shell"><Link className="text-link back-link" href="/#looks"><ArrowLeft size={16}/>Back to the edit</Link>
    <div className="look-detail-grid"><section className="look-story"><LookPhoto panel={look.panel} title={look.title} priority/>
      <p className="edit-caption">AI-generated styling inspiration. Related accessories are not exact photo matches. Coat, clothing, shoes and other props are not sold with this look.</p>
      <div className="styling-note"><span className="small-label">WHY IT WORKS</span><p>{look.story}</p><p className="muted">{look.tip}</p></div>
      <div className="wardrobe-note"><span className="small-label">BRING FROM YOUR WARDROBE</span><ul>{look.wardrobe.map(item => <li key={item}><Check size={15}/>{item}</li>)}</ul></div>
    </section><section className="look-builder"><div className="builder-heading"><span className="small-label">DIGO EDIT · {look.scene.toUpperCase()}</span><button className={`save-look static ${saved.includes(look.slug) ? "is-saved" : ""}`} onClick={() => toggle(look.slug)} aria-label={saved.includes(look.slug) ? "Unsave look" : "Save look"} aria-pressed={saved.includes(look.slug)}><Heart size={19} fill={saved.includes(look.slug) ? "currentColor" : "none"}/></button></div>
      <h1>{look.title}</h1><p className="builder-intro">{look.subtitle}</p>
      <div className="delivery-panel"><CalendarDays size={20}/><div><strong>Delivery dates are being confirmed.</strong><p>Arrival for a specific date cannot be promised yet. Save this look if you need it soon.</p></div></div>
      <h2>Make it yours.</h2><p className="context-note">Choose related accessories below. Uncheck anything you already own, or swap for another option.</p>
      <div className="builder-slots">{slots.map((slot,i) => {
        const product=slot.products.find(p => p.id===chosen[i]);
        return <div className={`builder-slot ${included[i] ? "included" : ""}`} key={slot.label}>
          <label className="slot-check"><input type="checkbox" checked={included[i]} disabled={!product} onChange={e => setIncluded(values => values.map((v,j) => j===i ? e.target.checked : v))}/><span>{slot.label}</span><span className="slot-state">{product ? included[i] ? "Include" : "I’ll use my own" : "Unavailable"}</span></label>
          {product ? <><div className="slot-info"><div className="piece-monogram" aria-hidden="true">{product.category === "Gloves" ? "G" : product.category === "Beanie" || product.category === "Beret" ? "H" : "S"}</div><div><Link href={`/products/${product.slug}`} className="product-name">{product.name}</Link><p>{product.material}</p><small>{product.dimensions} · {product.weight}</small></div><strong>{formatMoney(product.price_cents,product.currency)}</strong></div>
            <label className="swap-field">Choose a style<select aria-label={`Style for ${slot.label}`} value={chosen[i]} onChange={e => setChosen(values => values.map((v,j) => j===i ? e.target.value : v))}>{slot.products.map(p => <option key={p.id} value={p.id}>{p.name} · {p.style_code} · {formatMoney(p.price_cents,p.currency)}</option>)}</select></label><div className="slot-meta"><span>Delivery: to be confirmed</span><Link href={`/products/${product.slug}`}>Details ↗</Link></div></> : <p className="context-note">This piece is unavailable. Use something you already own or save the look for later.</p>}
        </div>;
      })}</div>
      <div className="selection-summary"><div><span>All suggested accessories</span><span>{formatMoney(fullTotal)}</span></div><div className="selected-total"><strong>Your {selected.length} selected {selected.length === 1 ? "piece" : "pieces"}</strong><strong>{formatMoney(total)}</strong></div><p>Accessory prices only. The complete pictured outfit is not for sale. Colours and availability need confirmation.</p></div>
      <div className="purchase-options" aria-label="Purchase type"><button aria-pressed={kind === "retail"} className={kind === "retail" ? "active" : ""} onClick={() => setKind("retail")}>Full price</button><button disabled={!depositsAvailable} aria-pressed={kind === "reservation"} className={kind === "reservation" ? "active" : ""} onClick={() => setKind("reservation")}>Reservation deposit</button></div>
      {kind === "reservation" && <p className="deposit-note">Deposit: {formatMoney(deposit)} · Remaining product balance: {formatMoney(total-deposit)}. Reservations are currently test-only; placing a test reservation does not place a real production order.</p>}
      <button className="editorial-button add-selection" disabled={!selected.length || (kind === "reservation" && !depositsAvailable)} onClick={addSelected}><ShoppingBag size={18}/>Add selected to bag · {formatMoney(kind === "reservation" ? deposit : total)}</button>
      {cart.testMode === true && <p className="context-note">Test checkout — no real money is charged.</p>}
      {!cart.available && <p className="context-note">Payments are being set up. You can still build your bag and save looks.</p>}
      <p className="builder-feedback" role="status">{message || storageError}</p>
    </section></div>
  </main>;
}
