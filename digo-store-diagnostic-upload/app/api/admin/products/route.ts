import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import { getSupabaseAdminClient } from "@/lib/supabase";

export const runtime = "nodejs";
export const maxDuration = 30;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET(request: Request) {
  const adminSecret = process.env.ADMIN_SECRET;
  const providedSecret = request.headers.get("x-admin-secret");

  if (providedSecret !== adminSecret) {
    return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
  }

  const supabase = getSupabaseAdminClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    const providedSecret = request.headers.get("x-admin-secret");

    if (!adminSecret) {
      return NextResponse.json(
        { error: "Missing ADMIN_SECRET in Vercel environment variables." },
        { status: 500 }
      );
    }

    if (providedSecret !== adminSecret) {
      return NextResponse.json({ error: "Invalid admin password." }, { status: 401 });
    }

    const requiredEnv = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "SUPABASE_PRODUCTS_BUCKET"
    ];
    const missingEnv = requiredEnv.filter((key) => !process.env[key]);

    if (missingEnv.length > 0) {
      return NextResponse.json(
        { error: `Missing Vercel environment variable(s): ${missingEnv.join(", ")}` },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const name = String(formData.get("name") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const price = Number(String(formData.get("price") ?? "").trim());
    const image = formData.get("image");

    if (!name || !Number.isFinite(price) || price <= 0 || !(image instanceof File)) {
      return NextResponse.json(
        { error: "Name, valid price, and image are required." },
        { status: 400 }
      );
    }

    if (image.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image is too large. Please upload an image under 4 MB." },
        { status: 413 }
      );
    }

    const supabase = getSupabaseAdminClient();
    const bucket = process.env.SUPABASE_PRODUCTS_BUCKET ?? "product-images";
    const extension = image.name.split(".").pop() || "jpg";
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const imagePath = `${slug}.${extension}`;
    const imageBytes = Buffer.from(await image.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(imagePath, imageBytes, {
        contentType: image.type || "application/octet-stream",
        cacheControl: "3600",
        upsert: false
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Supabase image upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicImage } = supabase.storage
      .from(bucket)
      .getPublicUrl(imagePath);

    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        name,
        slug,
        description,
        price_cents: Math.round(price * 100),
        currency: "usd",
        image_url: publicImage.publicUrl,
        active: true
      })
      .select("*")
      .single();

    if (insertError) {
      return NextResponse.json(
        { error: `Supabase product insert failed: ${insertError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Server error: ${error.message}`
            : "Server error: unknown upload failure."
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const adminSecret = process.env.ADMIN_SECRET;
    const providedSecret = request.headers.get("x-admin-secret");

    if (!adminSecret) {
      return NextResponse.json(
        { error: "Missing ADMIN_SECRET in Vercel environment variables." },
        { status: 500 }
      );
    }

    if (providedSecret !== adminSecret) {
      return NextResponse.json(
        { error: "Invalid admin password." },
        { status: 401 }
      );
    }

    const supabase = getSupabaseAdminClient();

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", params.id);

    if (error) {
      return NextResponse.json(
        { error: `Supabase product delete failed: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Server error: ${error.message}`
            : "Server error: unknown product delete failure.",
      },
      { status: 500 }
    );
  }
}
