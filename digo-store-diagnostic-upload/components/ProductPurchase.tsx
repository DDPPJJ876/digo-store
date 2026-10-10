"use client";
import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import type { PurchaseKind, ReservationPlan } from "@/lib/purchase";
import { formatMoney } from "@/lib/money";
import { PurchaseOptions } from "./PurchaseOptions";
import { useCart } from "./CartProvider";

export function ProductPurchase({ product }: { product: Product }) {
  const canReserve = Number.isSafeInteger(product.reserve_price_cents) && product.reserve_price_cents! > 0 && product.reserve_price_cents! < product.price_cents;
  const [kind, setKind] = useState<PurchaseKind>(canReserve ? "reservation" : "retail");
  const [plan, setPlan] = useState<ReservationPlan>("refundable");
  const cart = useCart();
  return <>
    <PurchaseOptions kind={kind} plan={plan} onKind={setKind} onPlan={setPlan} total={product.price_cents} deposit={product.reserve_price_cents ?? 0} currency={product.currency} canReserve={canReserve}/>
    <button className="editorial-button add-selection" onClick={() => cart.addItem(product,kind,kind === "reservation" ? plan : undefined)}><ShoppingBag size={17}/>{kind === "reservation" ? "Reserve this piece" : "Add to bag"} · {formatMoney(kind === "reservation" ? product.reserve_price_cents! : product.price_cents, product.currency)}</button>
    <p className="context-note">{cart.testMode ? "Test checkout only — no real money is charged." : "Payments are being set up. Build your bag while we prepare."}</p>
  </>;
}
