import { Order } from "../../../types/order";
import { OrderCard } from "./OrderCard";

interface OrdersGridProps {
  orders: Order[];
  onOrderClick: (order: Order) => void;
}

export const OrdersGrid: React.FC<OrdersGridProps> = ({
  orders,
  onOrderClick,
}) => {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <svg
          className="w-24 h-24 mb-4 text-gray-300 dark:text-gray-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
          No pending orders
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} onClick={onOrderClick} />
      ))}
    </div>
  );
};
