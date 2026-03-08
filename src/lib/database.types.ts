export interface ShopCategory {
  id: string; // UUID
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ShopProduct {
  id: string; // UUID
  category_id: string | null; // UUID
  name: string;
  slug: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export interface ShopProductVariant {
  id: string; // UUID
  product_id: string; // UUID
  name: string;
  size: string | null;
  design: string | null;
  price: number; // Stored as integer (e.g., INR amount)
  stock_quantity: number;
  sku: string | null;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}
