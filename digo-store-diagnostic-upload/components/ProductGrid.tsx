import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

const RESERVE_PRICE = "$4.50";

function ProductPlaceholder({ product }: { product: Product }) {
  const material = product.name.split(" — ")[0];
  return (
    <div className="product-media empty" style={{ minHeight: 320, flexDirection: "column", gap: 10 }}>
      <span className="eyebrow">DIGO DISCOVERY</span>
      <strong style={{ fontSize: 22, textAlign: "center", maxWidth: 220 }}>{material}</strong>
      <span className="muted">Supplier-original image coming next</span>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="panel">
        <h2>No products yet</h2>
        <p className="muted">Open Admin to upload your first product.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <article className="product-card" key={product.id}>
          <Link href={`/products/${product.slug}`} className="product-media">
            {product.image_url ? (
              <Image src={product.image_url} alt={product.name} width={900} height={900} />
            ) : (
              <ProductPlaceholder product={product} />
            )}
          </Link>
          <div className="product-info">
            <Link href={`/products/${product.slug}`}>
              <h2>{product.name}</h2>
            </Link>
            <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap", marginBottom: 10 }}>
              <span className="price">{formatMoney(product.price_cents, product.currency)}</span>
              <span className="muted">Retail price</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div>
                <strong style={{ fontSize: 18 }}>{RESERVE_PRICE} Reserve</strong>
                <div className="muted" style={{ fontSize: 13 }}>Reserve now. Demand unlocks the order.</div>
              </div>
              <AddToCartButton product={product} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
