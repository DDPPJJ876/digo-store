"use client";
import Link from "next/link";
import { Heart, ShoppingBag, Search } from "lucide-react";
import { useCart } from "./CartProvider";
export function Header() {
  const cart = useCart();
  return <header className="topbar editorial-topbar"><Link href="/" className="brand" aria-label="Digo home">digo.</Link>
    <nav className="primary-nav" aria-label="Main navigation"><Link href="/#looks">Discover looks</Link><Link href="/shop">All pieces</Link><Link href="/#about">The Digo way</Link></nav>
    <nav className="nav" aria-label="Shopping"><Link href="/shop" className="header-icon" aria-label="Search pieces"><Search size={19}/></Link><Link href="/saved" className="header-icon" aria-label="Saved looks"><Heart size={19}/></Link><button className="header-icon bag-button" onClick={() => cart.setOpen(true)} aria-label={`Open bag, ${cart.count} items`}><ShoppingBag size={19}/><span>{cart.count}</span></button></nav>
  </header>;
}
