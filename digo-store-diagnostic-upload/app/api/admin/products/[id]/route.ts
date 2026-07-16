import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

function authorize(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const providedSecret = request.headers.get("x-admin-secret");
  return Boolean(adminSecret) && providedSecret === adminSecret;
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const body = await request.json();
  const updates: Record<string, unknown> = {};

  if (typeof body.active === "boolean") updates.active = body.active;
  if (typeof body.name === "string" && body.name.trim()) updates.name = body.name.trim();
  if (typeof body.description === "string") updates.description = body.description.trim();
  if (typeof body.price === "number" && Number.isFinite(body.price) && body.price > 0) {
    updates.price_cents = Math.round(body.price * 100);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid product changes supplied." }, { status: 400 });
  }

  const supabase = getSupabaseAdminClient();
  const { data: product, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!authorize(request)) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
