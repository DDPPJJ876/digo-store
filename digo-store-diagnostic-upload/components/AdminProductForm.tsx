"use client";

import { FormEvent, useState } from "react";
import { UploadCloud } from "lucide-react";

export function AdminProductForm() {
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string }>();
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(undefined);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const secret = String(formData.get("adminSecret") ?? "");
    const image = formData.get("image");

    if (image instanceof File && image.size > 4 * 1024 * 1024) {
      setBusy(false);
      setStatus({
        type: "error",
        text: "Image is too large. Please upload an image under 4 MB."
      });
      return;
    }

    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 25000);
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "x-admin-secret": secret },
        body: formData,
        signal: controller.signal
      });
      window.clearTimeout(timeout);

      const payload = await response
        .json()
        .catch(() => ({ error: "Upload failed. The server did not return details." }));
      setBusy(false);

      if (!response.ok) {
        setStatus({ type: "error", text: payload.error ?? "Upload failed." });
        return;
      }

      form.reset();
      setStatus({ type: "ok", text: `Product published: ${payload.product.name}` });
    } catch (error) {
      setBusy(false);
      setStatus({
        type: "error",
        text:
          error instanceof DOMException && error.name === "AbortError"
            ? "Upload timed out after 25 seconds. Check the Vercel function logs for the exact Supabase error."
            : "Upload failed. Please check the image size and Vercel environment variables."
      });
    }
  }

  return (
    <form className="form panel" onSubmit={submit}>
      <label className="field">
        <span>Admin password</span>
        <input name="adminSecret" type="password" required />
      </label>

      <label className="field">
        <span>Product name</span>
        <input name="name" required placeholder="Example: Classic Tee" />
      </label>

      <label className="field">
        <span>Price in dollars</span>
        <input name="price" inputMode="decimal" required placeholder="49.00" />
      </label>

      <label className="field">
        <span>Description</span>
        <textarea name="description" placeholder="Material, fit, details..." />
      </label>

      <label className="field">
        <span>Product image</span>
        <input name="image" type="file" accept="image/*" required />
      </label>
      <p className="muted" style={{ margin: 0 }}>
        Use JPG, PNG, or WebP under 4 MB.
      </p>

      <button className="button primary" disabled={busy}>
        <UploadCloud size={18} />
        {busy ? "Uploading..." : "Publish product"}
      </button>

      {status ? <div className={`status ${status.type}`}>{status.text}</div> : null}
    </form>
  );
}
