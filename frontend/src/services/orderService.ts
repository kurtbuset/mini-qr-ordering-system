import { apiClient } from "./apiClient";
import { Order, CreateOrderRequest } from "../types/order";

export const orderService = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
};

/**
 * Get all orders
 */
async function getAllOrders(): Promise<Order[]> {
  return apiClient.get<Order[]>("/orders");
}

/**
 * Get order by ID
 */
async function getOrderById(id: number): Promise<Order> {
  return apiClient.get<Order>(`/orders/${id}`);
}

/**
 * Create a new order
 */
async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  return apiClient.post<Order>("/orders", orderData, { skipAuth: true });
}

/**
 * Update an existing order
 */
async function updateOrder(
  id: number,
  orderData: Partial<Order>,
): Promise<Order> {
  return apiClient.put<Order>(`/orders/${id}`, orderData);
}
