import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { getStripe } from "@/lib/stripe";
import type { Product } from "@/lib/types";

type CheckoutItem = {
  id: string;
  quantity: number;
  size?: string;
  color?: string;
};

export async function POST(request: Request) {
  const { items } = (await request.json()) as { items?: CheckoutItem[] };
  if (!items?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const ids = items.map((item) => item.id);
  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.from("products").select("*").in("id", ids).eq("active", true);
  if (error || !data?.length) {
    return NextResponse.json({ error: "Products could not be found." }, { status: 400 });
  }

  const products = data as Product[];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const stripe = getStripe();
  const normalizedItems = items.map((item) => ({
    id: item.id,
    quantity: Math.max(1, Math.min(item.quantity, 99)),
    size: item.size?.slice(0, 20),
    color: item.color?.slice(0, 40)
  }));

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card", "alipay", "wechat_pay", "us_bank_account"],
    success_url: `${siteUrl}/checkout/success`,
    cancel_url: `${siteUrl}/checkout/cancel`,
    line_items: normalizedItems.map((item) => {
      const product = products.find((candidate) => candidate.id === item.id);
      if (!product) throw new Error("Product not found.");
      const variant = [item.color, item.size].filter(Boolean).join(" / ");
      return {
        quantity: item.quantity,
        price_data: {
          currency: product.currency,
          unit_amount: product.price_cents,
          product_data: {
            name: variant ? `${product.name} — ${variant}` : product.name,
            description: product.description ?? undefined,
            images: product.image_url ? [product.image_url] : undefined,
            metadata: {
              size: item.size ?? "",
              color: item.color ?? ""
            }
          }
        }
      };
    }),
    metadata: { items: JSON.stringify(normalizedItems) }
  });

  return NextResponse.json({ url: session.url });
}
