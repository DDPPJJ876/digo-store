"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";

export function Header() {
  const cart = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  if (pathname.startsWith("/admin")) {
    return (
      <header className="topbar">
        <Link href="/" className="brand">DIGO</Link>
        <nav className="nav">
          <Link className="button" href="/admin">
            <Upload size={17} /> Admin
          </Link>
          <button className="button" onClick={() => cart.setOpen(true)}>
            <ShoppingBag size={17} /> {cart.count}
          </button>
        </nav>
      </header>
    );
  }

  return (
    <header className="site-header">
      <Link className="wordmark" href="/#top" aria-label="DIGO home">
        DIGO<span>®</span>
      </Link>
      <nav className={menuOpen ? "nav-links nav-open" : "nav-links"} aria-label="Primary navigation">
        <Link href="/#collection" onClick={() => setMenuOpen(false)}>Collection</Link>
        <Link href="/#twin" onClick={() => setMenuOpen(false)}>Digital twin</Link>
        <Link href="/#material" onClick={() => setMenuOpen(false)}>Material lab</Link>
        <Link href="/#about" onClick={() => setMenuOpen(false)}>About</Link>
      </nav>
      <div className="header-actions">
        <button className="bag-button" onClick={() => cart.setOpen(true)} aria-label={`Open bag with ${cart.count} items`}>
          Bag <span>{String(cart.count).padStart(2, "0")}</span>
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen((value) => !value)}
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
