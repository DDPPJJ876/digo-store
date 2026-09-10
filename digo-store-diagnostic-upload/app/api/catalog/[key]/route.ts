import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BUCKET = "digo-catalog";
const TEMP_UPLOAD_TOKEN = "digo-catalog-20260901-7f3a1c9e";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, serviceKey };
}

function cleanKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, "");
}

async function ensurePublicBucket(url: string, serviceKey: string) {
  const response = await fetch(`${url}/storage/v1/bucket`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      id: BUCKET,
      name: BUCKET,
      public: true,
      file_size_limit: 5242880,
      allowed_mime_types: ["image/jpeg", "image/png", "image/webp"]
    })
  });

  if (!response.ok && response.status !== 409) {
    const message = await response.text();
    throw new Error(`Unable to prepare catalog bucket: ${message}`);
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { key: string } }
) {
  const key = cleanKey(params.key);
  const { url } = getSupabaseConfig();

  if (!url || !key) {
    return new NextResponse("Image unavailable", { status: 404 });
  }

  const assetUrl = `${url}/storage/v1/object/public/${BUCKET}/${key}.jpg`;
  const response = await fetch(assetUrl, { cache: "no-store" });

  if (!response.ok) {
    return new NextResponse("Image unavailable", { status: 404 });
  }

  return new NextResponse(await response.arrayBuffer(), {
    status: 200,
    headers: {
      "Content-Type": response.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=3600, s-maxage=86400"
    }
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  if (request.headers.get("x-digo-upload-token") !== TEMP_UPLOAD_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = cleanKey(params.key);
  const { url, serviceKey } = getSupabaseConfig();

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Supabase storage is not configured" },
      { status: 503 }
    );
  }

  if (!key) {
    return NextResponse.json({ error: "Invalid image key" }, { status: 400 });
  }

  const bytes = await request.arrayBuffer();
  if (!bytes.byteLength || bytes.byteLength > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Invalid image size" }, { status: 400 });
  }

  await ensurePublicBucket(url, serviceKey);

  const upload = await fetch(
    `${url}/storage/v1/object/${BUCKET}/${key}.jpg`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        "Content-Type": request.headers.get("content-type") || "image/jpeg",
        "x-upsert": "true"
      },
      body: bytes
    }
  );

  if (!upload.ok) {
    return NextResponse.json(
      { error: await upload.text() },
      { status: upload.status }
    );
  }

  return NextResponse.json({
    ok: true,
    key,
    imageUrl: `/api/catalog/${key}`
  });
}
