import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatMoney } from "@/lib/money";
import { getProductBySlug } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
          <div className="product-media empty">No image</div>
        )}
      </div>

      <section className="detail-copy">
        <h1>{product.name}</h1>
        <div className="price">
          {formatMoney(product.price_cents, product.currency)}
        </div>
        {product.description ? <p>{product.description}</p> : null}
        <AddToCartButton product={product} />
      </section>
    </main>
  );
}
