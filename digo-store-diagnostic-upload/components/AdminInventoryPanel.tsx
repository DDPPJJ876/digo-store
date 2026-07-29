"use client";

import { useState } from "react";

export function AdminInventoryPanel() {
  const [items] = useState([
    { name: "Lace Bandeau", color: "Black", size: "S", stock: 20 },
    { name: "Lace Bandeau", color: "Black", size: "M", stock: 15 },
    { name: "Lace Bandeau", color: "White", size: "S", stock: 10 },
  ]);

  return (
    <section className="panel" style={{ marginTop: 24 }}>
      <p className="eyebrow">INVENTORY MANAGEMENT</p>
      <h2>Stock & Variants</h2>
      <p className="muted">
        Manage colors, sizes, SKU inventory, and future fabric data.
      </p>

      <div className="admin-table">
        <div className="admin-table-head">
          <span>Product</span>
          <span>Color</span>
          <span>Size</span>
          <span>Stock</span>
        </div>
        {items.map((item, index) => (
          <div className="admin-table-row" key={index}>
            <strong>{item.name}</strong>
            <span>{item.color}</span>
            <span>{item.size}</span>
            <strong>{item.stock}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
