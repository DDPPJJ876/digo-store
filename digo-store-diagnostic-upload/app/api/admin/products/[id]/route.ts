import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminSecret = process.env.ADMIN_SECRET;
  const providedSecret = request.headers.get("x-admin-secret");

  if (providedSecret !== adminSecret) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const body = await request.json();
  const supabase = getSupabaseAdminClient();

  const { data: product, error } = await supabase
    .from("products")
    .update({ active: body.active === true })
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ product });
}
