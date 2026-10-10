import type { Product } from "./types";
// Internal sourcing costs are not part of the customer-facing product payload.
export function storefrontProduct(product: Product): Product {
  const { supplier_price_cny, ...publicProduct } = product;
  return publicProduct;
}
