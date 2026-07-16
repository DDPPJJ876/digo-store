"use client";

import { FormEvent, useMemo, useState } from "react";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  LogIn,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  X
} from "lucide-react";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";

type Notice = { type: "ok" | "error"; text: string };

export function AdminProductManager() {
  const [secret, setSecret] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [status, setStatus] = useState<Notice>();
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState<"all" | "active" | "hidden">("all");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesText =
        !normalized ||
        product.name.toLowerCase().includes(normalized) ||
        (product.description ?? "").toLowerCase().includes(normalized);
      const matchesVisibility =
        visibility === "all" ||
        (visibility === "active" ? product.active : !product.active);
      return matchesText && matchesVisibility;
    });
  }, [products, query, visibility]);

  const activeCount = products.filter((product) => product.active).length;

  async function loadProducts(event?: FormEvent<HTMLFormElement>, quiet = false) {
    event?.preventDefault();
    setBusy(true);
    if (!quiet) setStatus(undefined);

    try {
      const response = await fetch("/api/admin/products", {
        headers: { "x-admin-secret": secret }
      });
      const payload = await response.json();

      if (!response.ok) {
        setAuthenticated(false);
        setStatus({ type: "error", text: payload.error ?? "Could not load products." });
        return;
      }

      setProducts(payload.products);
      setAuthenticated(true);
      if (!quiet) setStatus({ type: "ok", text: "Product data is up to date." });
    } catch {
      setStatus({ type: "error", text: "Could not connect to the server." });
    } finally {
      setBusy(false);
    }
  }

  async function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus(undefined);
    const form = event.currentTarget;
    const formData = new FormData(form);
    const image = formData.get("image");

    if (image instanceof File && image.size > 4 * 1024 * 1024) {
      setBusy(false);
      setStatus({ type: "error", text: "Image must be under 4 MB." });
      return;
    }

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "x-admin-secret": secret },
        body: formData
      });
      const payload = await response.json();

      if (!response.ok) {
        setStatus({ type: "error", text: payload.error ?? "Could not create product." });
        return;
      }

      setProducts((current) => [payload.product, ...current]);
      setShowCreate(false);
      form.reset();
      setStatus({ type: "ok", text: `${payload.product.name} was published.` });
    } catch {
      setStatus({ type: "error", text: "Upload failed. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setBusy(true);
    setStatus(undefined);
    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/admin/products/${editing.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": secret
      },
      body: JSON.stringify({
        name: String(formData.get("name") ?? ""),
        price: Number(formData.get("price")),
        description: String(formData.get("description") ?? "")
      })
    });
    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setStatus({ type: "error", text: payload.error ?? "Could not save changes." });
      return;
    }

    setProducts((current) =>
      current.map((item) => (item.id === editing.id ? payload.product : item))
    );
    setEditing(null);
    setStatus({ type: "ok", text: "Product details saved." });
  }

  async function setProductActive(product: Product, active: boolean) {
    setBusy(true);
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
    setStatus({ type: "ok", text: active ? "Product is now online." : "Product is now hidden." });
  }

  async function removeProduct(product: Product) {
    if (!window.confirm(`Permanently delete “${product.name}”?`)) return;
    setBusy(true);

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: "DELETE",
      headers: { "x-admin-secret": secret }
    });
    const payload = await response.json();
    setBusy(false);

    if (!response.ok) {
      setStatus({ type: "error", text: payload.error ?? "Could not delete product." });
      return;
    }

    setProducts((current) => current.filter((item) => item.id !== product.id));
    setStatus({ type: "ok", text: "Product deleted." });
  }

  if (!authenticated) {
    return (
      <section className="admin-login panel">
        <div className="admin-login-icon"><Package size={28} /></div>
        <h2>DIGO Business Console</h2>
        <p className="muted">Sign in with your company administrator password.</p>
        <form onSubmit={loadProducts} className="form">
          <label className="field">
            <span>Administrator password</span>
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              required
              autoFocus
            />
          </label>
          <button className="button primary" disabled={busy}>
            <LogIn size={17} />
            {busy ? "Signing in..." : "Enter dashboard"}
          </button>
        </form>
        {status ? <div className={`status ${status.type}`}>{status.text}</div> : null}
      </section>
    );
  }

  return (
    <section className="admin-dashboard">
      <div className="admin-toolbar">
        <div>
          <p className="eyebrow">DIGO BUSINESS CONSOLE</p>
          <h1>Product management</h1>
          <p className="muted">Create, edit, publish, hide, and remove storefront products.</p>
        </div>
        <div className="admin-toolbar-actions">
          <button className="button" onClick={() => loadProducts(undefined, true)} disabled={busy}>
            <RefreshCw size={17} /> Refresh
          </button>
          <button className="button primary" onClick={() => setShowCreate(true)}>
            <Plus size={17} /> Add product
          </button>
        </div>
      </div>

      <div className="admin-stats">
        <div className="admin-stat"><span>Total products</span><strong>{products.length}</strong></div>
        <div className="admin-stat"><span>Online</span><strong>{activeCount}</strong></div>
        <div className="admin-stat"><span>Hidden</span><strong>{products.length - activeCount}</strong></div>
      </div>

      <div className="admin-controls panel">
        <label className="admin-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
          />
        </label>
        <select value={visibility} onChange={(event) => setVisibility(event.target.value as typeof visibility)}>
          <option value="all">All statuses</option>
          <option value="active">Online</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {status ? <div className={`status ${status.type}`}>{status.text}</div> : null}

      <div className="admin-table panel">
        <div className="admin-table-head">
          <span>Product</span><span>Price</span><span>Status</span><span>Actions</span>
        </div>
        {filteredProducts.map((product) => (
          <div className="admin-table-row" key={product.id}>
            <div className="admin-product-identity">
              <div className="admin-product-thumb">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} width={72} height={72} />
                ) : null}
              </div>
              <div><strong>{product.name}</strong><small>{product.description || "No description"}</small></div>
            </div>
            <strong>{formatMoney(product.price_cents, product.currency)}</strong>
            <span className={`admin-badge ${product.active ? "online" : "hidden"}`}>
              {product.active ? "Online" : "Hidden"}
            </span>
            <div className="admin-product-actions">
              <button className="icon-button" title="Edit product" onClick={() => setEditing(product)}>
                <Pencil size={16} />
              </button>
              <button
                className="icon-button"
                title={product.active ? "Hide product" : "Publish product"}
                disabled={busy}
                onClick={() => setProductActive(product, !product.active)}
              >
                {product.active ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button className="icon-button danger" title="Delete product" disabled={busy} onClick={() => removeProduct(product)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 ? <div className="admin-empty">No matching products.</div> : null}
      </div>

      {(showCreate || editing) ? (
        <div className="admin-modal-backdrop" onMouseDown={() => { setShowCreate(false); setEditing(null); }}>
          <div className="admin-modal panel" onMouseDown={(event) => event.stopPropagation()}>
            <div className="cart-row">
              <div><p className="eyebrow">{editing ? "EDIT PRODUCT" : "NEW PRODUCT"}</p><h2>{editing ? editing.name : "Add a product"}</h2></div>
              <button className="icon-button" onClick={() => { setShowCreate(false); setEditing(null); }}><X size={18} /></button>
            </div>
            <form className="form" onSubmit={editing ? saveProduct : createProduct}>
              <label className="field"><span>Product name</span><input name="name" defaultValue={editing?.name} required /></label>
              <label className="field"><span>Price (USD)</span><input name="price" type="number" min="0.01" step="0.01" defaultValue={editing ? editing.price_cents / 100 : ""} required /></label>
              <label className="field"><span>Description</span><textarea name="description" defaultValue={editing?.description ?? ""} /></label>
              {!editing ? <label className="field"><span>Product image (JPG, PNG or WebP; max 4 MB)</span><input name="image" type="file" accept="image/*" required /></label> : null}
              <div className="admin-modal-actions">
                <button type="button" className="button" onClick={() => { setShowCreate(false); setEditing(null); }}>Cancel</button>
                <button className="button primary" disabled={busy}>{busy ? "Saving..." : editing ? "Save changes" : "Publish product"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
