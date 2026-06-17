import React, { useState } from "react";
import { Modal } from "../../ui/modal";
import { useCart } from "../../../context/CartContext";
import { orderService } from "../../../services/orderService";
import { CreateOrderRequest } from "../../../types/order";
import PaymentModal, { PaymentResult } from "../../payment/PaymentModal";
import { OrderSuccessModal } from "./OrderSuccessModal";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose }) => {
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [orderType, setOrderType] = useState<"dine_in" | "takeout">("dine_in");
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<
    "debit_card" | "credit_card" | "pay_at_counter"
  >("pay_at_counter");
  const [notes, setNotes] = useState("");

  // Payment modal state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] =
    useState<CreateOrderRequest | null>(null);

  // Success modal state
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const resetForm = () => {
    setOrderType("dine_in");
    setTableNumber("");
    setCustomerName("");
    setPaymentMethod("pay_at_counter");
    setNotes("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    setOrderNumber("");
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate
    if (orderType === "dine_in" && !tableNumber.trim()) {
      setError("Table number is required for dine-in orders");
      return;
    }

    if (orderType === "takeout" && !customerName.trim()) {
      setError("Customer name is required for takeout orders");
      return;
    }

    // Prepare order data
    const orderData: CreateOrderRequest = {
      order_type: orderType,
      total_amount: cart.totalAmount,
      payment_method: paymentMethod,
      notes: notes.trim() || undefined,
      items: cart.items.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        subtotal: item.subtotal,
      })),
    };

    if (orderType === "dine_in") {
      orderData.table_number = tableNumber.trim();
    } else {
      orderData.customer_name = customerName.trim();
    }

    // If card payment, close order modal and show payment modal
    if (paymentMethod === "debit_card" || paymentMethod === "credit_card") {
      setPendingOrderData(orderData);
      onClose(); // Close the order modal first
      setShowPaymentModal(true);
    } else {
      // For pay at counter, submit directly
      onClose();
      await submitOrder(orderData);
    }
  };

  const submitOrder = async (
    orderData: CreateOrderRequest,
    paymentData?: PaymentResult,
  ) => {
    setIsSubmitting(true);
    try {
      // Add payment info if available
      const finalOrderData = paymentData
        ? {
            ...orderData,
            payment_transaction_id: paymentData.transactionId,
            payment_card_last4: paymentData.last4Digits,
            payment_card_type: paymentData.cardType,
          }
        : orderData;

      // Submit order
      const response = await orderService.createOrder(finalOrderData);

      setOrderNumber(response.order_number);
      clearCart();
      setShowPaymentModal(false);
      setPendingOrderData(null);
      setShowSuccessModal(true);
    } catch (err: any) {
      setError(err.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentData: PaymentResult) => {
    if (pendingOrderData) {
      submitOrder(pendingOrderData, paymentData);
    }
  };

  const handlePaymentFailed = (errorMessage: string) => {
    setError(`Payment failed: ${errorMessage}`);
    setShowPaymentModal(false);
    setPendingOrderData(null);
  };

  return (
    <>
      {/* Payment Modal - Renders after order modal closes */}
      {showPaymentModal && pendingOrderData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPendingOrderData(null);
          }}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailed={handlePaymentFailed}
          amount={pendingOrderData.total_amount}
          paymentMethod={
            pendingOrderData.payment_method as "debit_card" | "credit_card"
          }
        />
      )}

      {/* Success Modal - Shows after order is completed */}
      <OrderSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessClose}
        orderNumber={orderNumber}
      />

      <Modal isOpen={isOpen} onClose={handleClose} className="max-w-2xl mx-4">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Your Order
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Fill in the details below to place your order
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Order Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Order Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType("dine_in")}
                  className={`rounded-lg border-2 px-4 py-3 text-center font-medium transition-all ${
                    orderType === "dine_in"
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  Dine In
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType("takeout")}
                  className={`rounded-lg border-2 px-4 py-3 text-center font-medium transition-all ${
                    orderType === "takeout"
                      ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  Takeout
                </button>
              </div>
            </div>

            {/* Conditional Fields */}
            {orderType === "dine_in" ? (
              <div>
                <label
                  htmlFor="tableNumber"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Table Number <span className="text-red-500">*</span>
                </label>
                <select
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  required
                >
                  <option value="">Select a table</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      Table {num}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="customerName"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label
                htmlFor="paymentMethod"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Payment Method <span className="text-red-500">*</span>
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                required
              >
                <option value="pay_at_counter">Pay at Counter</option>
                <option value="debit_card">Debit Card</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Special Instructions (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                placeholder="Any special requests or dietary requirements..."
              />
            </div>

            {/* Order Summary */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
              <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Order Summary
              </h3>
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm text-gray-600 dark:text-gray-400"
                  >
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>P{item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-gray-200 pt-3 dark:border-gray-700">
                <span className="font-bold text-gray-900 dark:text-white">
                  Total
                </span>
                <span className="text-xl font-bold text-brand-600">
                  P{cart.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-500 px-6 py-4 text-lg font-semibold text-white transition-colors hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Placing Order..."
                : paymentMethod === "pay_at_counter"
                  ? "Place Order"
                  : "Continue to Payment"}
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
};
