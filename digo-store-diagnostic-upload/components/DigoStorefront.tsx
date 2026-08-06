"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DIGO_HERO } from "@/lib/digo-hero";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";

const MATERIAL_METRICS = [
  { label: "Softness", value: 86, note: "skin-soft hand" },
  { label: "Stretch", value: 64, note: "2-way recovery" },
  { label: "Drape", value: 72, note: "close to body" },
  { label: "Structure", value: 78, note: "boned support" }
];
const SIZES = ["XS", "S", "M", "L"];

function Metric({ label, value, note }: (typeof MATERIAL_METRICS)[number]) {
  return (
    <div className="metric">
      <div className="metric-top"><span>{label}</span><span>{value}</span></div>
      <div className="metric-track" aria-label={`${label}: ${value} out of 100`}><span style={{ width: `${value}%` }} /></div>
      <p>{note}</p>
    </div>
  );
}

function MaterialOrb({ active }: { active: string }) {
  return (
    <div className={`material-orb material-${active.toLowerCase()}`} aria-hidden="true">
      <span className="orb-grid" />
      <span className="orb-thread thread-one" />
      <span className="orb-thread thread-two" />
      <span className="orb-thread thread-three" />
    </div>
  );
}

export function DigoStorefront({ products }: { products: Product[] }) {
  const cart = useCart();
  const featured = products[0];
  const [twinOpen, setTwinOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState("Ivory");
  const [activeLayer, setActiveLayer] = useState("Lace");

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setTwinOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  const displayName = featured?.name || "Lace Bandeau 01";
  const displayDescription = featured?.description ||
    "A structured lace bandeau engineered to hold its line while moving with the body. Fully lined, softly boned and finished in a low-pressure elastic edge.";
  const displayPrice = featured ? formatMoney(featured.price_cents, featured.currency) : "$128";

  return (
    <main className="digo-storefront">
      <section className="hero" id="top" aria-label="DIGO garment digital twin introduction">
        <div className="hero-glow" />
        <img className="hero-model" src={DIGO_HERO} alt="Pearl ceramic digital mannequin wearing an ivory lace bandeau" />
        <div className="hero-index" aria-hidden="true"><span>BODY / 01</span><span>MATERIAL / 04</span></div>
        <div className="hero-reveal hero-title">
          <p>Garment digital twin / 001</p>
          <h1>Real cloth.<br />Digital form.</h1>
        </div>
        <div className="hero-reveal hero-detail">
          <p>Not a product image.</p>
          <p>A computable garment identity built from material, pattern and body.</p>
          <a href="#collection">Explore the first form <span>↘</span></a>
        </div>
        <a className="scroll-cue" href="#manifesto" aria-label="Scroll to continue"><span>05 sec / enter</span><i /></a>
      </section>

      <section className="manifesto" id="manifesto">
        <div className="section-number">01 — Representation</div>
        <p className="manifesto-kicker">Clothing online is usually flattened into an image and a size chart.</p>
        <h2>We give a garment its physics back.</h2>
        <div className="manifesto-grid">
          <p>DIGO translates real fabric, pattern geometry and the body into a shared digital representation—so fit can be understood before the garment arrives.</p>
          <div className="principles">
            <span><b>01</b> Material behavior</span>
            <span><b>02</b> Pattern geometry</span>
            <span><b>03</b> Body interaction</span>
          </div>
        </div>
      </section>

      <section className="twin-section" id="twin">
        <div className="twin-visual">
          <img src={DIGO_HERO} alt="Digital garment shown in a close material study" />
          <div className="scan-line" />
          <div className="scan-label scan-a"><span /> Bust tension</div>
          <div className="scan-label scan-b"><span /> Side recovery</div>
          <div className="scan-label scan-c"><span /> Hem stability</div>
          <button className="glass-button" onClick={() => setTwinOpen(true)}>Open digital identity <span>↗</span></button>
        </div>
        <div className="twin-copy">
          <div className="section-number">02 — Digital twin</div>
          <p className="eyebrow">Lace Form 01 / LF-001</p>
          <h2>A garment you can inspect, not just look at.</h2>
          <p className="body-copy">Every DIGO piece carries a material passport: measurable softness, stretch, drape, thickness and structural recovery—paired with its pattern construction.</p>
          <div className="metric-list">{MATERIAL_METRICS.map((metric) => <Metric key={metric.label} {...metric} />)}</div>
        </div>
      </section>

      <section className="material-lab" id="material">
        <div className="material-copy">
          <div className="section-number">03 — Material lab</div>
          <p className="eyebrow">Four layers / one behavior</p>
          <h2>Built from the fiber up.</h2>
          <p className="body-copy">Select a layer to examine how the garment changes. The profile updates as material and construction move from surface to structure.</p>
          <div className="layer-switcher" role="tablist" aria-label="Material layers">
            {["Lace", "Mesh", "Elastic", "Bone"].map((layer, index) => (
              <button key={layer} role="tab" aria-selected={activeLayer === layer} className={activeLayer === layer ? "active" : ""} onClick={() => setActiveLayer(layer)}>
                <span>0{index + 1}</span>{layer}
              </button>
            ))}
          </div>
        </div>
        <div className="material-stage">
          <MaterialOrb active={activeLayer} />
          <div className="material-caption">
            <div><span>Layer</span><b>{activeLayer}</b></div>
            <div><span>Scale</span><b>24×</b></div>
            <div><span>Profile</span><b>{activeLayer === "Bone" ? "Support" : activeLayer === "Elastic" ? "Recovery" : activeLayer === "Mesh" ? "Breathable" : "Tactile"}</b></div>
          </div>
        </div>
      </section>

      <section className="collection" id="collection">
        <div className="collection-head">
          <div><div className="section-number">04 — First form</div><h2>{displayName}</h2></div>
          <p>One focused garment. Digitized deeply.<br />Small-batch release / 100 units.</p>
        </div>
        <div className="product-grid">
          <div className="product-image-wrap">
            <img src={DIGO_HERO} alt={`${displayName} in ivory on a pearl mannequin`} />
            <span className="edition">01 / 100</span>
            <button className="image-zoom" onClick={() => setTwinOpen(true)} aria-label="Inspect garment digital twin">+</button>
          </div>
          <div className="product-panel">
            <div className="product-title-row">
              <div><p className="eyebrow">Launch edition</p><h3>{displayName}</h3></div>
              <p className="price">{displayPrice}</p>
            </div>
            <p className="product-description">{displayDescription}</p>
            <fieldset>
              <legend>Color <span>{selectedColor}</span></legend>
              <div className="color-options">
                {["Ivory", "Graphite"].map((color) => (
                  <button key={color} className={`${color.toLowerCase()} ${selectedColor === color ? "selected" : ""}`} onClick={() => setSelectedColor(color)} aria-label={`Select ${color}`} aria-pressed={selectedColor === color} />
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>Size <button onClick={() => setTwinOpen(true)}>Find your form</button></legend>
              <div className="size-options">
                {SIZES.map((size) => <button key={size} className={selectedSize === size ? "selected" : ""} onClick={() => setSelectedSize(size)}>{size}</button>)}
              </div>
            </fieldset>
            <button className="add-button" disabled={!featured} onClick={() => featured && cart.addItem(featured, { size: selectedSize, color: selectedColor })}>
              {featured ? "Add to bag" : "Release opening soon"}<span>{displayPrice} / {selectedSize}</span>
            </button>
            <div className="product-notes"><span>Free international delivery</span><span>Material passport included</span><span>14-day fit exchange</span></div>
          </div>
        </div>

        {products.length > 1 ? (
          <div className="release-list">
            {products.slice(1).map((product, index) => (
              <Link href={`/products/${product.slug}`} className="release-card" key={product.id}>
                <div className="release-media"><img src={product.image_url || DIGO_HERO} alt={product.name} /><span>0{index + 2}</span></div>
                <div><h3>{product.name}</h3><p>{formatMoney(product.price_cents, product.currency)} <span>View form ↗</span></p></div>
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="system-section" id="about">
        <div className="section-number">05 — The system</div>
        <h2>From real cloth to a computable garment.</h2>
        <div className="system-flow">
          {[
            ["01", "Measure", "Capture fiber, stretch, weight, friction and recovery from the physical fabric."],
            ["02", "Represent", "Connect material behavior with pattern geometry and garment construction."],
            ["03", "Simulate", "Observe how the complete garment changes across movement and body shape."],
            ["04", "Learn", "Use real fit feedback to improve the next pattern before more fabric is cut."]
          ].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}
        </div>
      </section>

      <section className="closing"><p>Material × Pattern × Body</p><h2>The physical layer<br />for digital fashion.</h2><a href="#collection">Enter the first release <span>↗</span></a></section>
      <footer><a className="wordmark footer-mark" href="#top">DIGO<span>®</span></a><p>Garment digital physics / Seattle — Guangzhou</p><div><a href="mailto:studio@digo.world">Contact</a><a href="#top">Top ↑</a></div></footer>

      <div className={twinOpen ? "modal-backdrop visible" : "modal-backdrop"} onClick={() => setTwinOpen(false)} />
      <section className={twinOpen ? "twin-modal open" : "twin-modal"} role="dialog" aria-modal="true" aria-label="Garment digital identity" aria-hidden={!twinOpen}>
        <div className="modal-head"><p>DIGO / Digital identity 001</p><button onClick={() => setTwinOpen(false)} aria-label="Close digital identity">×</button></div>
        <div className="modal-body">
          <div className="modal-model"><img src={DIGO_HERO} alt="Detailed digital mannequin view" /><div className="target-ring ring-one" /><div className="target-ring ring-two" /></div>
          <div className="passport">
            <p className="eyebrow">Material passport / verified</p><h2>Lace Form 01</h2>
            <div className="passport-id"><span>DIGO-ID</span><b>LF001-IV-26</b><span>Pattern</span><b>4 panels / 8 bones</b><span>Fabric</span><b>Lace / mesh / elastic</b><span>Weight</span><b>164 g</b></div>
            <div className="metric-list compact">{MATERIAL_METRICS.map((metric) => <Metric key={metric.label} {...metric} />)}</div>
            <button className="modal-cta" onClick={() => { setTwinOpen(false); document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" }); }}>Choose this form <span>↘</span></button>
          </div>
        </div>
      </section>
    </main>
  );
}
