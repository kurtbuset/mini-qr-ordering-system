import { apiClient } from "./apiClient";
import { Product } from "../types/product";

export const productService = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
};

/**
 * Get all products
 */
async function getAllProducts(): Promise<Product[]> {
  return apiClient.get<Product[]>("/products", { skipAuth: true });
}

/**
 * Get product by ID
 */
async function getProductById(id: number): Promise<Product> {
  return apiClient.get<Product>(`/products/${id}`, { skipAuth: true });
}

/**
 * Get products by category
 */
async function getProductsByCategory(category: string): Promise<Product[]> {
  return apiClient.get<Product[]>(`/products/category/${category}`, {
    skipAuth: true,
  });
}
