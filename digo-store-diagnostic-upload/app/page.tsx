import { ProductGrid } from "@/components/ProductGrid";
import { getActiveProducts } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">DIGO · DISCOVER FROM CHINA</p>
          <h1>Things China is making right now.</h1>
          <p>
            Discover wool, cashmere, yak and alpaca accessories sourced from
            China-based suppliers. Browse first. Demand decides what Digo brings
            to market.
          </p>
          <a className="button primary" href="#collection">
            Start Exploring
          </a>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 32 }}>
        <h2>Discover first. Stock second.</h2>
        <p>
          Digo turns real shopper interest into a supply signal. We curate products
          from China-based suppliers, test demand, and only move winning products
          into inventory.
        </p>
        <div className="admin-stats" style={{ marginTop: 24 }}>
          <div className="admin-stat"><span>Supplier styles</span><strong>{products.length}+</strong></div>
          <div className="admin-stat"><span>Materials</span><strong>Wool · Cashmere · Yak · Alpaca</strong></div>
          <div className="admin-stat"><span>Inventory model</span><strong>Demand-led</strong></div>
        </div>
      </section>

      <section id="collection" style={{ marginTop: 48 }}>
        <p className="eyebrow">DISCOVER</p>
        <h2>Winter accessories from China</h2>
        <p className="muted">Scarves, wraps, beanies, gloves and socks curated for overseas shoppers.</p>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
