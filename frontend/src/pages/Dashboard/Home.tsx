import { useEffect, useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import { StatCard, RecentOrders } from "../../components/dashboard";
import LineChartOne from "../../components/charts/line/LineChartOne";
import { orderService } from "../../services/orderService";
import { Order } from "../../types/order";
import { OrderDetailModal } from "../../components/order";

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const orders = await orderService.getAllOrders();

      // Calculate stats
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(
        (o) => o.order_status === "pending",
      ).length;
      const totalRevenue = orders
        .filter((o) => o.order_status === "completed")
        .reduce((sum, order) => sum + Number(order.total_amount), 0);
      const averageOrderValue =
        totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setStats({
        totalOrders,
        pendingOrders,
        totalRevenue,
        averageOrderValue,
      });

      // Get recent orders (last 5)
      const recent = orders
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 5);
      setRecentOrders(recent);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      await loadDashboardData();
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
      await loadDashboardData();
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
      </div>
    );
  }

  return (
    <>
      <PageMeta
        title="Dashboard | Mini QR Ordering System"
        description="Admin dashboard for managing orders and viewing statistics"
      />

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
            colorClass="bg-blue-500"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            colorClass="bg-yellow-500"
            subtitle="Awaiting completion"
          />
          <StatCard
            title="Total Revenue"
            value={`₱${stats.totalRevenue.toFixed(2)}`}
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
            colorClass="bg-green-500"
            trend={{ value: 8.5, isPositive: true }}
          />
          <StatCard
            title="Average Order"
            value={`₱${stats.averageOrderValue.toFixed(2)}`}
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            }
            colorClass="bg-purple-500"
          />
        </div>

        {/* Charts and Recent Orders */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Sales Chart */}
          <div className="xl:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Sales Overview
              </h3>
              <LineChartOne />
            </div>
          </div>

          {/* Recent Orders */}
          <div className="xl:col-span-1">
            <RecentOrders
              orders={recentOrders}
              onOrderClick={handleOrderClick}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="/orders"
            className="flex items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/20">
              <svg
                className="h-6 w-6 text-brand-600 dark:text-brand-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Manage Orders
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                View and update orders
              </p>
            </div>
          </a>

          <a
            href="/products"
            className="flex items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
              <svg
                className="h-6 w-6 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Manage Products
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update menu items
              </p>
            </div>
          </a>

          <a
            href="/generate-qr"
            className="flex items-center rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-brand-600"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">
                Generate QR Code
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Create QR for tables
              </p>
            </div>
          </a>
        </div>
      </div>

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
