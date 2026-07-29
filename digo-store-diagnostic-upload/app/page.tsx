import { ProductGrid } from "@/components/ProductGrid";
import { getActiveProducts } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">DIGO DIGITAL FASHION</p>
          <h1>The Future of Digital Fashion.</h1>
          <p>
            Transforming physical fabrics into digital experiences. Every garment
            carries a new identity built from material, design, and technology.
          </p>
          <a className="button primary" href="#collection">
            Explore Collection
          </a>
        </div>
      </section>

      <section className="panel" style={{ marginTop: 32 }}>
        <h2>Physical Fabric. Digital Intelligence.</h2>
        <p>
          DIGO combines real-world fabric knowledge with digital product
          experiences, bringing customers closer to understanding how garments
          look, feel, and fit.
        </p>
        <div className="admin-stats" style={{ marginTop: 24 }}>
          <div className="admin-stat"><span>Fabric Data</span><strong>Digital</strong></div>
          <div className="admin-stat"><span>Garment Identity</span><strong>Unique</strong></div>
          <div className="admin-stat"><span>Fit Experience</span><strong>Future</strong></div>
        </div>
      </section>

      <section id="collection" style={{ marginTop: 48 }}>
        <p className="eyebrow">COLLECTION</p>
        <ProductGrid products={products} />
      </section>
    </main>
  );
}
