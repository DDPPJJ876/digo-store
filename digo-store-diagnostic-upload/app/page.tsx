import { storefrontProduct } from "@/lib/storefront";
import { Discovery } from "@/components/Discovery";
import { getActiveProducts } from "@/lib/supabase";
export const dynamic = "force-dynamic";
export default async function HomePage() { return <Discovery products={(await getActiveProducts()).map(storefrontProduct)} />; }
