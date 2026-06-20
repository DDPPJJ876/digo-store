import { ProductGrid } from "@/components/ProductGrid";
import { getActiveProducts } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <h1>Your products, ready to sell.</h1>
          <p>
            Upload product photos and details from the admin page. Customers can
            browse, add to cart, and pay through Stripe Checkout.
          </p>
        </div>
      </section>

      <ProductGrid products={products} />
    </main>
  );
}
