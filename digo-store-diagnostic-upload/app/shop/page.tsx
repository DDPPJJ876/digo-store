import { storefrontProduct } from "@/lib/storefront";
import { getActiveProducts } from "@/lib/supabase";
import { ShopBrowser } from "@/components/ShopBrowser";
export const dynamic = "force-dynamic";
export default async function ShopPage() { return <ShopBrowser products={(await getActiveProducts()).map(storefrontProduct)} />; }
