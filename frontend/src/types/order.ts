export interface OrderItem {
  id?: number;
  order_id?: number;
  product_id: number;
  product_name?: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  product?: {
    id: number;
    name: string;
    price: number;
    image_url?: string;
  };
}

export interface CreateOrderRequest {
  table_number?: string;
  customer_name?: string;
  total_amount: number;
  order_type: "dine_in" | "takeout";
  payment_method: "debit_card" | "credit_card" | "pay_at_counter";
  notes?: string;
  items: OrderItem[];
  payment_transaction_id?: string;
  payment_card_last4?: string;
  payment_card_type?: string;
}

export interface Order {
  id: number;
  order_number: string;
  table_number?: string;
  customer_name?: string;
  total_amount: number;
  order_type: "dine_in" | "takeout";
  order_status: "pending" | "completed" | "cancelled";
  payment_method: "debit_card" | "credit_card" | "pay_at_counter";
  payment_status: "pending" | "paid" | "failed";
  payment_notes?: string;
  payment_transaction_id?: string;
  payment_card_last4?: string;
  payment_card_type?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  orderItems?: OrderItem[];
}
