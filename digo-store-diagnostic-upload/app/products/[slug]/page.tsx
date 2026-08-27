import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatMoney } from "@/lib/money";
import { getProductBySlug } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const reserve = product.reserve_price_cents ?? 450;

  return (
    <main className="shell detail">
      <div className="product-media">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} width={1200} height={1200} priority />
        ) : (
          <div
            className="product-media empty"
            style={{ minHeight: 620, padding: 42, flexDirection: "column", alignItems: "flex-start", justifyContent: "space-between" }}
          >
            <div>
              <p className="eyebrow">DIGO · CHINA SUPPLIER CATALOG</p>
              <div className="muted">SOURCE {product.source_catalog ?? "—"} / STYLE {product.style_code ?? "—"}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 10 }}>
                {product.category ?? "Accessory"}
              </div>
              <strong style={{ fontSize: 48, lineHeight: 1.02, maxWidth: 520, display: "block" }}>
                {product.material ?? product.name}
              </strong>
            </div>
            <div className="muted">Product imagery will be replaced with supplier-cleared original assets.</div>
          </div>
        )}
      </div>

      <section className="detail-copy">
        <p className="eyebrow">DIGO DISCOVERY · STYLE {product.style_code}</p>
        <h1>{product.name}</h1>
        <div className="price">{formatMoney(product.price_cents, product.currency)}</div>
        <p className="muted">Retail price</p>

        <div className="panel" style={{ margin: "20px 0" }}>
          <p className="eyebrow">RESERVE TODAY</p>
          <h2 style={{ marginBottom: 8 }}>{formatMoney(reserve, "usd")}</h2>
          <p style={{ marginBottom: 8 }}>
            Reserve before Digo stocks the item. B-type discount reservations are the strong-demand signal used to decide whether procurement is unlocked.
          </p>
          <p className="muted" style={{ marginBottom: 0 }}>
            If procurement is not unlocked, the reservation is refunded. Once a B reservation unlocks procurement, its deposit follows the locked-price cancellation terms shown at payment.
          </p>
        </div>

        <div className="panel" style={{ margin: "20px 0" }}>
          <p className="eyebrow">PRODUCT DETAILS</p>
          <div className="admin-stats" style={{ marginTop: 16 }}>
            <div className="admin-stat"><span>Style</span><strong>{product.style_code ?? "—"}</strong></div>
            <div className="admin-stat"><span>Category</span><strong>{product.category ?? "—"}</strong></div>
            <div className="admin-stat"><span>Material</span><strong>{product.material ?? "—"}</strong></div>
            <div className="admin-stat"><span>Weight</span><strong>{product.weight ?? "—"}</strong></div>
            <div className="admin-stat"><span>Size</span><strong>{product.dimensions ?? "—"}</strong></div>
            <div className="admin-stat"><span>Source</span><strong>Supplier Catalog {product.source_catalog ?? "—"}</strong></div>
          </div>
        </div>

        {product.description ? <p>{product.description}</p> : null}
        <p className="eyebrow" style={{ marginTop: 24 }}>BUY AT RETAIL</p>
        <AddToCartButton product={product} />
      </section>
    </main>
  );
}
