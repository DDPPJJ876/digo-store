"use client";

import Link from "next/link";
import { useState } from "react";
import { DIGO_HERO } from "@/lib/digo-hero";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

export function DigoProductView({ product }: { product: Product }) {
  const cart = useCart();
  const [size, setSize] = useState("S");
  const [color, setColor] = useState("Ivory");

  return (
    <main className="digo-product-page">
      <div className="digo-product-visual">
        <img src={product.image_url || DIGO_HERO} alt={product.name} />
        <span>Garment / {product.slug}</span>
      </div>
      <section className="digo-product-copy">
        <p className="eyebrow">DIGO / Launch edition</p>
        <h1>{product.name}</h1>
        <p className="price">{formatMoney(product.price_cents, product.currency)}</p>
        <p className="product-description">{product.description}</p>
        <fieldset><legend>Color <span>{color}</span></legend><div className="color-options">{["Ivory", "Graphite"].map((item) => <button key={item} className={`${item.toLowerCase()} ${color === item ? "selected" : ""}`} onClick={() => setColor(item)} aria-label={`Select ${item}`} />)}</div></fieldset>
        <fieldset><legend>Size <span>{size}</span></legend><div className="size-options">{["XS", "S", "M", "L"].map((item) => <button key={item} className={size === item ? "selected" : ""} onClick={() => setSize(item)}>{item}</button>)}</div></fieldset>
        <button className="add-button" onClick={() => cart.addItem(product, { size, color })}>Add to bag <span>{formatMoney(product.price_cents, product.currency)} / {size}</span></button>
        <Link className="product-back" href="/#collection">← Back to collection</Link>
      </section>
    </main>
  );
}
