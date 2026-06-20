"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Eye, EyeOff, RefreshCw, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";

export function AdminProductManager() {
  const [secret, setSecret] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<{ type: "ok" | "error"; text: string }>();
  const [busy, setBusy] = useState(false);

  async function loadProducts(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setBusy(true);
    setStatus(undefined);

    const response = await fetch("/api/admin/products", {
      headers: { "x-admin-secret": secret }
    });
    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setStatus({ type: "error", text: payload.error ?? "Could not load products." });
      return;
    }

    setProducts(payload.products);
    setStatus({ type: "ok", text: `Loaded ${payload.products.length} products.` });
  }

  async function setProductActive(product: Product, active: boolean) {
    setBusy(true);
    setStatus(undefined);

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret
      },
      body: JSON.stringify({ active })
    });
    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setStatus({ type: "error", text: payload.error ?? "Could not update product." });
      return;
    }

    setProducts((current) =>
      current.map((item) => (item.id === product.id ? payload.product : item))
    );
    setStatus({
      type: "ok",
      text: active ? "Product is visible on the storefront." : "Product is hidden."
    });
  }

  async function removeProduct(product: Product) {
    const confirmed = window.confirm(`Remove ${product.name}?`);

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setStatus(undefined);

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret }
    });
    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setStatus({ type: "error", text: payload.error ?? "Could not remove product." });
      return;
    }

    setProducts((current) => current.filter((item) => item.id !== product.id));
    setStatus({ type: "ok", text: "Product removed." });
  }

  function formatAddedDate(value: string) {
    return new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(new Date(value));
  }

  return (
    <section className="panel admin-manager">
      <div className="cart-row">
        <div>
          <h2 style={{ margin: 0 }}>Manage products</h2>
          <p className="muted" style={{ margin: "6px 0 0" }}>
            Hide duplicates or bring products back online.
          </p>
        </div>
      </div>

      <form className="admin-manager-form" onSubmit={loadProducts}>
        <label className="field">
          <span>Admin password</span>
          <input
            type="password"
            value={secret}
            onChange={(event) => setSecret(event.target.value)}
            required
          />
        </label>
        <button className="button" disabled={busy}>
          <RefreshCw size={17} />
          {busy ? "Loading..." : "Load products"}
        </button>
      </form>

      {status ? <div className={`status ${status.type}`}>{status.text}</div> : null}

      <div className="admin-product-list">
        {products.map((product) => (
          <div className="admin-product-row" key={product.id}>
            <div className="admin-product-thumb">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.name}
                  width={72}
                  height={72}
                />
              ) : null}
            </div>
            <div>
              <strong>{product.name}</strong>
              <div className="muted">{product.description}</div>
            </div>
            <div className="admin-product-meta">
              <span>Price</span>
              <strong>{formatMoney(product.price_cents, product.currency)}</strong>
            </div>
            <div className="admin-product-meta">
              <span>Added</span>
              <strong>{formatAddedDate(product.created_at)}</strong>
              <small>{product.active ? "Visible" : "Hidden"}</small>
            </div>
            <div className="admin-product-actions">
              <button
                className={product.active ? "button" : "button primary"}
                disabled={busy}
                onClick={() => setProductActive(product, !product.active)}
              >
                {product.active ? <EyeOff size={17} /> : <Eye size={17} />}
                {product.active ? "Hide" : "Show"}
              </button>
              <button
                className="button danger"
                disabled={busy}
                onClick={() => removeProduct(product)}
              >
                <Trash2 size={17} />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
