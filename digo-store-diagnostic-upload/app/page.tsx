import { DigoStorefront } from "@/components/DigoStorefront";
import { getActiveProducts } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getActiveProducts();
  return <DigoStorefront products={products} />;
}
