import { storefrontProduct } from "@/lib/storefront";
import { notFound } from "next/navigation";
import { looks, getLookSlots } from "@/lib/looks";
import { getActiveProducts } from "@/lib/supabase";
import { LookBuilder } from "@/components/LookBuilder";
export const dynamic = "force-dynamic";
export default async function LookPage({params}: {params: {slug: string}}) {
  const look = looks.find(l => l.slug === params.slug);
  if (!look) notFound();
  return <LookBuilder look={look} slots={getLookSlots(look, (await getActiveProducts()).map(storefrontProduct))} />;
}
