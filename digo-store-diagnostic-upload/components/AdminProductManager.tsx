"use client";

import { FormEvent, useState } from "react";
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import type { Product } from "@/lib/types";

export function AdminProductManager() {
  const [secret, setSecret] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");

  async function loadProducts(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus("");

    const response = await fetch("/api/admin/products", {
      headers: { "x-admin-secret": secret },
    });

    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setStatus(payload.error ?? "Could not load products.");
      return;
    }

    setProducts(payload.products);
    setStatus(`Loaded ${payload.products.length} products.`);
  }

  async function toggleProduct(product: Product) {
    setBusy(true);

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret,
      },
      body: JSON.stringify({ active: !product.active }),
    });

    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setStatus(payload.error ?? "Could not update product.");
      return;
    }

    setProducts((current) =>
      current.map((item) =>
        item.id === product.id ? payload.product : item
      )
    );
  }

  return (
    <section className="panel admin-manager">
      <h2>Manage products</h2>

      <form onSubmit={loadProducts} className="admin-manager-form">
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

      {status ? <div className="status ok">{status}</div> : null}

      <div className="admin-product-list">
        {products.map((product) => (
          <div className="admin-product-row" key={product.id}>
            <strong>{product.name}</strong>
            <span>{product.active ? "Visible" : "Hidden"}</span>
            <button
              className="button"
              disabled={busy}
              onClick={() => toggleProduct(product)}
            >
              {product.active ? <EyeOff size={17} /> : <Eye size={17} />}
              {product.active ? "Hide" : "Show"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
