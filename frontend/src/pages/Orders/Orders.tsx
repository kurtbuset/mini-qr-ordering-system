import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { orderService } from "../../services/orderService";
import { Order } from "../../types/order";
import {
  OrderFilters,
  OrdersGrid,
  OrderDetailModal,
} from "../../components/order";
import PageMeta from "../../components/common/PageMeta";
import { useAuthStore } from "../../store/authStore";

type OrderTypeFilter = "all" | "dine_in" | "takeout";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<OrderTypeFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const account = useAuthStore((state) => state.account);

  useEffect(() => {
    loadOrders();

    // Only connect to socket if user is authenticated
    if (!account || !account.jwtToken) {
      console.log("No authenticated user, skipping socket connection");
      return;
    }

    // Initialize Socket.IO connection with JWT authentication
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      auth: {
        token: account.jwtToken, // Send JWT token for backend verification
      },
    });

    // Handle authentication errors
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully:", socket.id);
      // Backend now auto-joins admin room if user role is Admin
    });

    // Listen for new orders (only admins will receive this)
    socket.on("newOrder", (newOrder: Order) => {
      console.log("New order received:", newOrder);
      // Only add if it's a pending order
      if (newOrder.order_status === "pending") {
        setOrders((prevOrders) => [newOrder, ...prevOrders]);
      }
    });

    // Listen for order updates (only admins will receive this)
    socket.on("orderUpdated", (updatedOrder: Order) => {
      console.log("Order updated:", updatedOrder);
      setOrders((prevOrders) => {
        // If order is no longer pending, remove it from the list
        if (updatedOrder.order_status !== "pending") {
          return prevOrders.filter((order) => order.id !== updatedOrder.id);
        }
        // Otherwise, update the order in the list
        return prevOrders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order,
        );
      });

      // Update selected order if it's currently open in modal
      if (selectedOrder && selectedOrder.id === updatedOrder.id) {
        setSelectedOrder(updatedOrder);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [account?.jwtToken]); // Re-connect if token changes

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await orderService.getAllOrders();
      // Only show pending orders
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

  // Filter orders by type
  const filteredOrders = orders.filter((order) => {
    if (typeFilter === "all") return true;
    return order.order_type === typeFilter;
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateStatus = async (
    orderId: number,
    status: "completed" | "cancelled",
  ) => {
    try {
      await orderService.updateOrder(orderId, { order_status: status });
      // Remove order from list
      setOrders(orders.filter((order) => order.id !== orderId));
      setIsModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update order status");
    }
  };

  const handleUpdatePaymentStatus = async (
    orderId: number,
    paymentStatus: "paid" | "failed",
  ) => {
    try {
      await orderService.updateOrder(orderId, {
        payment_status: paymentStatus,
      });
      // Reload orders to reflect changes
      await loadOrders();
      // Update selectedOrder to reflect changes in modal immediately
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

  const getCategoryCount = (type: OrderTypeFilter) => {
    if (type === "all") return orders.length;
    return orders.filter((o) => o.order_type === type).length;
  };

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

      {/* Header */}
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

      {/* Category Filters */}
      <OrderFilters
        selectedFilter={typeFilter}
        onFilterChange={setTypeFilter}
        counts={filterCounts}
      />

      {/* Orders Grid */}
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
