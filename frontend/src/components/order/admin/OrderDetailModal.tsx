import { useState } from "react";
import { Modal } from "../../ui/modal";
import { Order } from "../../../types/order";
import { useToastStore } from "../../../store/toastStore";

interface OrderDetailModalProps {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: number, status: "completed" | "cancelled") => void;
  onUpdatePaymentStatus?: (
    orderId: number,
    paymentStatus: "paid" | "failed",
  ) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  order,
  onClose,
  onUpdateStatus,
  onUpdatePaymentStatus,
}) => {
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const addToast = useToastStore((state) => state.addToast);

  const formatCurrency = (amount: number) => {
    return `P${Number(amount).toFixed(2)}`;
  };

  const handlePaymentStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    if (!order || !onUpdatePaymentStatus) return;

    const newStatus = e.target.value as "paid" | "failed";

    if (window.confirm(`Confirm payment status change to "${newStatus}"?`)) {
      setIsUpdatingPayment(true);
      try {
        onUpdatePaymentStatus(order.id, newStatus);
      } catch (error) {
        console.error("Failed to update payment status:", error);
      } finally {
        setIsUpdatingPayment(false);
      }
    } else {
      // Reset to current value if cancelled
      e.target.value = order.payment_status;
    }
  };

  const handleCompleteOrder = () => {
    if (!order) return;
    if (window.confirm(`Mark order #${order.order_number} as completed?`)) {
      try {
        onUpdateStatus(order.id, "completed");
        addToast({
          variant: "success",
          title: "Order Completed",
          message: `Order #${order.order_number} has been marked as completed.`,
        });
      } catch (error) {
        addToast({
          variant: "error",
          title: "Failed to Complete Order",
          message:
            "An error occurred while completing the order. Please try again.",
        });
      }
    }
  };

  const handleCancelOrder = () => {
    if (!order) return;
    if (
      window.confirm(
        `Are you sure you want to cancel order #${order.order_number}? This action cannot be undone.`,
      )
    ) {
      try {
        onUpdateStatus(order.id, "cancelled");
        addToast({
          variant: "error",
          title: "Order Cancelled",
          message: `Order #${order.order_number} has been cancelled.`,
        });
      } catch (error) {
        addToast({
          variant: "error",
          title: "Failed to Cancel Order",
          message:
            "An error occurred while cancelling the order. Please try again.",
        });
      }
    }
  };

  const canCompleteOrder = order?.payment_status === "paid";

  if (!order) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl mx-4"
      showCloseButton={false}
    >
      <div className="max-h-[90vh] overflow-y-auto rounded-3xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Order #{order.order_number}
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {new Date(order.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order Type
              </p>
              <p className="mt-1 font-semibold text-gray-900 capitalize dark:text-white">
                {order.order_type.replace("_", " ")}
              </p>
            </div>
            {order.table_number && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Table Number
                </p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {order.table_number}
                </p>
              </div>
            )}
            {order.customer_name && (
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customer Name
                </p>
                <p className="mt-1 font-semibold text-gray-900 dark:text-white">
                  {order.customer_name}
                </p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Payment Method
              </p>
              <p className="mt-1 font-semibold text-gray-900 capitalize dark:text-white">
                {order.payment_method.replace("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Payment Status
              </p>
              {order.payment_method === "pay_at_counter" &&
              order.payment_status === "pending" ? (
                <select
                  value={order.payment_status}
                  onChange={handlePaymentStatusChange}
                  disabled={isUpdatingPayment}
                  className="w-full px-3 py-2 text-sm font-medium border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              ) : (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.payment_status === "paid"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                      : order.payment_status === "failed"
                        ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }`}
                >
                  {order.payment_status}
                </span>
              )}
            </div>
          </div>

          {/* Payment Details - Show for card payments */}
          {order.payment_transaction_id && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                Payment Details
              </p>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
                <p>
                  <span className="font-medium">Transaction ID:</span>{" "}
                  {order.payment_transaction_id}
                </p>
                {order.payment_card_type && order.payment_card_last4 && (
                  <p>
                    <span className="font-medium">Card:</span>{" "}
                    {order.payment_card_type} ending in{" "}
                    {order.payment_card_last4}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
              <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
                Notes
              </p>
              <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-400">
                {order.notes}
              </p>
            </div>
          )}

          {/* Order Items */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Order Items
            </h3>
            <div className="space-y-3">
              {order.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg dark:bg-gray-800"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {item.product?.name || `Product #${item.product_id}`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(item.unit_price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Amount
              </span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(order.total_amount)}
              </span>
            </div>
          </div>

          {/* Payment Status Warning */}
          {!canCompleteOrder && (
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg dark:bg-orange-900/20 dark:border-orange-800">
              <div className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-300">
                    Payment Required
                  </p>
                  <p className="text-sm text-orange-800 dark:text-orange-400 mt-1">
                    Order cannot be completed until payment is confirmed. Please
                    update payment status to "Paid" first.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <button
              onClick={handleCompleteOrder}
              disabled={!canCompleteOrder}
              className="px-6 py-3 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
              title={!canCompleteOrder ? "Payment must be confirmed first" : ""}
            >
              {canCompleteOrder ? "Mark as Completed" : "Payment Required"}
            </button>
            <button
              onClick={handleCancelOrder}
              className="px-6 py-3 font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
