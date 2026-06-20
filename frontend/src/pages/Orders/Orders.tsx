import { useEffect, useState, useCallback } from "react";
import { orderService } from "../../services/orderService";
import { Order } from "../../types/order";
import {
  OrderFilters,
  OrdersGrid,
  OrderDetailModal,
} from "../../components/order";
import PageMeta from "../../components/common/PageMeta";
import { useOrderSocket } from "../../hooks/useOrderSocket";

type OrderTypeFilter = "all" | "dine_in" | "takeout";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<OrderTypeFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // handle new order from socket (mutating list)
  const handleNewOrder = useCallback((newOrder: Order) => {
    // Only add if it's a pending order
    if (newOrder.order_status === "pending") {
      setOrders((prevOrders) => [newOrder, ...prevOrders]);
    }
  }, []);

  // handle order update from socket (mutating list)
  const handleOrderUpdated = useCallback(
    (updatedOrder: Order) => {
      setOrders((prevOrders) => {
        // if order is no longer pending, remove it from the list
        if (updatedOrder.order_status !== "pending") {
          return prevOrders.filter((order) => order.id !== updatedOrder.id);
        }
        // else, update the order in the list
        return prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        );
      });

      // Update selected order if it's currently open in modal
      if (selectedOrder && selectedOrder.id === updatedOrder.id) {
        setSelectedOrder(updatedOrder);
      }
    },
    [selectedOrder],
  );

  // initialize socket connection for real-time updates in receiving orders
  useOrderSocket({
    onNewOrder: handleNewOrder,
    onOrderUpdated: handleOrderUpdated,
  });

  // fetching orders
  useEffect(() => {
    loadOrders();
  }, []);

  // fetching orders data in server
  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.getAllOrders();
      // only show pending orders
      const pendingOrders = data.filter(
        (order) => order.order_status === "pending",
      );
      setOrders(pendingOrders);
    } catch (err) {
      setError("Failed to load orders");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // filter orders by type
  const filteredOrders = orders.filter((order) => {
    if (typeFilter === "all") return true;
    return order.order_type === typeFilter;
  });

  // when order is clicked, opens the order detail modal 
  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // updates order status
  const handleUpdateStatus = async (
    orderId: number,
    status: "completed" | "cancelled",
  ) => {
    try {
      await orderService.updateOrder(orderId, { order_status: status });
      // remove order from list
      setOrders(orders.filter((order) => order.id !== orderId));
      setIsModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update order status");
    }
  };

  // update payment status 
  const handleUpdatePaymentStatus = async (
    orderId: number,
    paymentStatus: "paid" | "failed",
  ) => {
    try {
      await orderService.updateOrder(orderId, {
        payment_status: paymentStatus,
      });
      // update the selectedOrder to reflect changes in modal immediately
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          payment_status: paymentStatus,
        });
      }
    } catch (err) {
      console.error("Failed to update payment status:", err);
      alert("Failed to update payment status");
    }
  };

  // get counts per category
  const getCategoryCount = (type: OrderTypeFilter) => {
    if (type === "all") return orders.length;
    return orders.filter((o) => o.order_type === type).length;
  };

  // object for counts per category
  const filterCounts = {
    all: getCategoryCount("all"),
    dine_in: getCategoryCount("dine_in"),
    takeout: getCategoryCount("takeout"),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full border-t-brand-500 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 text-red-700 bg-red-100 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Orders | Mini QR Ordering System"
        description="Manage and track customer orders for dine-in and takeout"
      />

      {/* header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Orders
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage pending customer orders
            </p>
          </div>
        </div>
      </div>

      {/* category filters */}
      <OrderFilters
        selectedFilter={typeFilter}
        onFilterChange={setTypeFilter}
        counts={filterCounts}
      />

      {/* orders grid */}
      <OrdersGrid orders={filteredOrders} onOrderClick={handleOrderClick} />

      {/* Order Detail Modal */}
      <OrderDetailModal
        isOpen={isModalOpen}
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePaymentStatus={handleUpdatePaymentStatus}
      />
    </>
  );
}
