import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/types";
export function ProductGrid({ products }: { products: Product[] }) {
  return <div className="product-grid">{products.map(product => <article className="product-card" key={product.id}>
    <Link href={`/products/${product.slug}`} className="product-media">{product.image_url ? <Image src={product.image_url} alt={product.name} width={600} height={600}/> : <div className="catalog-type-visual"><span>{product.category || "Accessory"}</span><strong>{product.material || product.name}</strong><small>Style {product.style_code || "—"} · Photo coming soon</small></div>}</Link>
    <div className="product-info"><Link href={`/products/${product.slug}`}><h2>{product.name}</h2></Link><p className="context-note" style={{margin:0}}>{product.material}{product.weight ? ` · ${product.weight}` : ""}</p><div className="look-price"><span>Full product price</span><strong>{formatMoney(product.price_cents,product.currency)}</strong></div><span className="delivery-note">Delivery to be confirmed</span><Link className="look-link" href={`/products/${product.slug}`}>View piece <ArrowUpRight size={16}/></Link></div>
  </article>)}</div>;
}
