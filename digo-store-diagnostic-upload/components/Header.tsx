"use client";

import Link from "next/link";
import { ShoppingBag, Upload } from "lucide-react";
import { useCart } from "./CartProvider";

export function Header() {
  const cart = useCart();

  return (
    <header className="topbar">
      <Link href="/" className="brand">
        DIGO
      </Link>
      <nav className="nav">
        <Link className="button" href="/admin">
          <Upload size={17} />
          Admin
        </Link>
        <button className="button" onClick={() => cart.setOpen(true)}>
          <ShoppingBag size={17} />
          {cart.count}
        </button>
      </nav>
    </header>
  );
}
