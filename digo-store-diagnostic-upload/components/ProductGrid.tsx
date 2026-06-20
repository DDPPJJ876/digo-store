import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
import { AddToCartButton } from "./AddToCartButton";

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
              <Image
                src={product.image_url}
                alt={product.name}
                width={900}
                height={900}
              />
            ) : (
              <div className="product-media empty">No image</div>
            )}
          </Link>
          <div className="product-info">
            <Link href={`/products/${product.slug}`}>
              <h2>{product.name}</h2>
            </Link>
            <div className="cart-row">
              <span className="price">
                {formatMoney(product.price_cents, product.currency)}
              </span>
              <AddToCartButton product={product} />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
