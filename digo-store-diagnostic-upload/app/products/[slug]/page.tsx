import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatMoney } from "@/lib/money";
import { getProductBySlug } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const RESERVE_PRICE = "$4.50";

export default async function ProductPage({
  params
}: {
  params: { slug: string };
}) {
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="shell detail">
      <div className="product-media">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={1200}
            height={1200}
            priority
          />
        ) : (
          <div className="product-media empty">Supplier-original image coming next</div>
        )}
      </div>

      <section className="detail-copy">
        <p className="eyebrow">DIGO DISCOVERY</p>
        <h1>{product.name}</h1>
        <div className="price">
          {formatMoney(product.price_cents, product.currency)}
        </div>
        <p className="muted">Retail price</p>

        <div className="panel" style={{ margin: "20px 0" }}>
          <p className="eyebrow">RESERVE TODAY</p>
          <h2 style={{ marginBottom: 8 }}>{RESERVE_PRICE}</h2>
          <p style={{ marginBottom: 8 }}>
            Reserve this product before Digo stocks it. Your reservation is the demand signal that helps unlock purchasing from the supplier.
          </p>
          <p className="muted" style={{ marginBottom: 0 }}>
            Reservation terms and A/B refund options will be shown before payment.
          </p>
        </div>

        {product.description ? <p>{product.description}</p> : null}
        <AddToCartButton product={product} />
      </section>
    </main>
  );
}
