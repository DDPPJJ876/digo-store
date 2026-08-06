export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  currency: string;
  image_url: string | null;
  active: boolean;
  created_at: string;
};

export type CartOptions = {
  size?: string;
  color?: string;
};

export type CartItem = {
  lineKey: string;
  product: Product;
  quantity: number;
  options: CartOptions;
};
