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

export type CartItem = {
  product: Product;
  quantity: number;
};
