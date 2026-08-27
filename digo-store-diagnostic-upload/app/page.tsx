import { ProductGrid } from "@/components/ProductGrid";
import { getActiveProducts } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();
  const supplierProducts = products.filter((product) => product.source_catalog);
  const otherProducts = products.filter((product) => !product.source_catalog);
  const wool = supplierProducts.filter((product) => (product.material ?? "").includes("Wool") && !(product.material ?? "").includes("Cashmere") && !(product.material ?? "").includes("Yak"));
  const cashmere = supplierProducts.filter((product) => (product.material ?? "").includes("Cashmere"));
  const yakAlpaca = supplierProducts.filter((product) => (product.material ?? "").includes("Yak") || (product.material ?? "").includes("Alpaca"));

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">DIGO · DISCOVER FROM CHINA</p>
          <h1>Things China is making right now.</h1>
          <p>
            Browse real supplier styles across wool, cashmere, yak and alpaca accessories.
            Reserve what you want first. Demand decides what Digo buys.
          </p>
          <a className="button primary" href="#wool">Start Exploring</a>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 32 }}>
        <h2>Browse first. Stock second.</h2>
        <p>
          Every supplier series is organized as a customer-facing product with its material,
          weight, dimensions, retail price and $4.50 reservation price. Strong B reservations
          are the procurement signal.
        </p>
        <div className="admin-stats" style={{ marginTop: 24 }}>
          <div className="admin-stat"><span>Supplier series</span><strong>{supplierProducts.length}</strong></div>
          <div className="admin-stat"><span>Collections</span><strong>Wool · Cashmere · Yak · Alpaca</strong></div>
          <div className="admin-stat"><span>Reserve</span><strong>$4.50</strong></div>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 22 }}>
          <a className="button" href="#wool">Wool</a>
          <a className="button" href="#cashmere">Cashmere</a>
          <a className="button" href="#yak-alpaca">Yak & Alpaca</a>
        </div>
      </section>

      <section id="wool" style={{ marginTop: 54 }}>
        <p className="eyebrow">WOOL EDIT</p>
        <h2>Wool scarves, hats, gloves & socks</h2>
        <p className="muted">Series-level products built directly from supplier catalog specifications.</p>
        <ProductGrid products={wool} />
      </section>

      <section id="cashmere" style={{ marginTop: 72 }}>
        <p className="eyebrow">CASHMERE EDIT</p>
        <h2>Cashmere scarves, wraps, hats & gloves</h2>
        <p className="muted">Pure cashmere and cashmere-wool blends, separated by their actual compositions.</p>
        <ProductGrid products={cashmere} />
      </section>

      <section id="yak-alpaca" style={{ marginTop: 72 }}>
        <p className="eyebrow">YAK & ALPACA</p>
        <h2>Natural fiber finds</h2>
        <p className="muted">Yak, yak-wool blends and alpaca accessories from the supplier catalog.</p>
        <ProductGrid products={yakAlpaca} />
      </section>

      {otherProducts.length ? (
        <section style={{ marginTop: 72 }}>
          <p className="eyebrow">OTHER DIGO PRODUCTS</p>
          <ProductGrid products={otherProducts} />
        </section>
      ) : null}
    </main>
  );
}
