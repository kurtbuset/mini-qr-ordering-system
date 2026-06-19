import React from "react";
import { Order } from "../../types/order";
import { Link } from "react-router";

interface RecentOrdersProps {
  orders: Order[];
  onOrderClick?: (order: Order) => void;
}

export const RecentOrders: React.FC<RecentOrdersProps> = ({
  orders
}) => {
  const getStatusBadge = (status: string) => {
    const styles = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
      completed:
        "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getOrderTypeIcon = (type: string) => {
    if (type === "dine_in") {
      return (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      );
    }
    return (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Orders
        </h3>
        <Link
          to="/orders"
          className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          View All
        </Link>
      </div>
      <div className="p-6">
        {orders.length === 0 ? (
          <div className="py-8 text-center text-gray-500 dark:text-gray-400">
            No recent orders
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:hover:border-brand-600"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      order.order_type === "dine_in"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                        : "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                    }`}
                  >
                    {getOrderTypeIcon(order.order_type)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {order.order_number}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {order.order_type === "dine_in"
                        ? `Table ${order.table_number}`
                        : order.customer_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ₱{Number(order.total_amount).toFixed(2)}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusBadge(
                        order.order_status,
                      )}`}
                    >
                      {order.order_status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
