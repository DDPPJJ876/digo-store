import { notFound } from "next/navigation";
import { DigoProductView } from "@/components/DigoProductView";
import { getProductBySlug } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();
  return <DigoProductView product={product} />;
}
