import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";

function ProductVisual({ product }: { product: Product }) {
  if (product.image_url) {
    return <Image src={product.image_url} alt={product.name} width={900} height={900} />;
  }

  return (
    <div
      className="product-media empty"
      style={{
        minHeight: 320,
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        padding: 28,
        textAlign: "left"
      }}
    >
      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 32 }}>
          <span className="eyebrow">DIGO / SOURCE {product.source_catalog ?? "—"}</span>
          <span className="muted">{product.category ?? "Accessory"}</span>
        </div>
        <div style={{ fontSize: 13, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 8 }}>
          Style {product.style_code ?? "—"}
        </div>
        <strong style={{ fontSize: 28, lineHeight: 1.05, display: "block", maxWidth: 280 }}>
          {product.material ?? product.name}
        </strong>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {product.weight ? <span className="button" style={{ pointerEvents: "none" }}>{product.weight}</span> : null}
        {product.dimensions ? <span className="button" style={{ pointerEvents: "none" }}>{product.dimensions}</span> : null}
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="panel">
        <h2>No products yet</h2>
        <p className="muted">The supplier catalog is being prepared.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => {
        const reserve = product.reserve_price_cents ?? 450;
        return (
          <article className="product-card" key={product.id}>
            <Link href={`/products/${product.slug}`} className="product-media">
              <ProductVisual product={product} />
            </Link>
            <div className="product-info">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                <Link href={`/products/${product.slug}`}>
                  <h2 style={{ marginBottom: 4 }}>{product.name}</h2>
                </Link>
                <span className="muted" style={{ whiteSpace: "nowrap" }}>{product.style_code}</span>
              </div>
              <p className="muted" style={{ margin: "0 0 14px", fontSize: 14 }}>
                {product.material}{product.weight ? ` · ${product.weight}` : ""}
              </p>

              <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", marginBottom: 12 }}>
                <span className="price">{formatMoney(product.price_cents, product.currency)}</span>
                <span className="muted">Retail</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div>
                  <strong style={{ fontSize: 18 }}>{formatMoney(reserve, "usd")} Reserve</strong>
                  <div className="muted" style={{ fontSize: 12 }}>B reservations drive procurement.</div>
                </div>
                <Link className="button primary" href={`/products/${product.slug}`}>
                  View & Reserve
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
