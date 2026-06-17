import { Order } from "../../../types/order";

interface OrderCardProps {
  order: Order;
  onClick: (order: Order) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return `P${Number(amount).toFixed(2)}`;
  };

  return (
    <button
      onClick={() => onClick(order)}
      className="p-4 text-left transition-all bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg dark:bg-gray-dark dark:border-gray-800 dark:hover:border-gray-700"
    >
      {/* Order Type Badge */}
      <div className="mb-3">
        <span className="px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full dark:bg-blue-900/30 dark:text-blue-400">
          {order.order_type === "dine_in" ? "DINE IN" : "TAKEOUT"}
        </span>
      </div>

      {/* Order Number */}
      <h3 className="mb-1 text-lg font-bold text-gray-900 dark:text-white">
        #{order.order_number}
      </h3>

      {/* Time */}
      <div className="flex items-center mb-3 text-sm text-gray-600 dark:text-gray-400">
        <svg
          className="w-4 h-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {formatTime(order.created_at)}
      </div>

      {/* Customer/Table Info */}
      {order.order_type === "dine_in" && order.table_number && (
        <div className="flex items-center mb-3 text-sm text-gray-700 dark:text-gray-300">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          Table {order.table_number}
        </div>
      )}

      {order.customer_name && (
        <div className="flex items-center mb-3 text-sm text-gray-700 dark:text-gray-300">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          {order.customer_name}
        </div>
      )}

      {/* Total Amount */}
      <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(order.total_amount)}
          </span>
        </div>
      </div>
    </button>
  );
};
