export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  is_available: boolean;
  created_at?: string;
  updated_at?: string;
}

export type ProductCategory = "Burgers" | "Hotdogs" | "Drinks" | "All";

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  "All",
  "Burgers",
  "Hotdogs",
  "Drinks",
];
