import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "../store/authStore";
import { Order } from "../types/order";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

interface UseOrderSocketProps {
  onNewOrder: (order: Order) => void;
  onOrderUpdated: (order: Order) => void;
}

/**
 * Custom hook to manage Socket.IO connection for real-time order updates
 * Automatically connects/disconnects based on authentication state
 */
export const useOrderSocket = ({
  onNewOrder,
  onOrderUpdated,
}: UseOrderSocketProps) => {
  const account = useAuthStore((state) => state.account);

  useEffect(() => {
    // Only connect to socket if user is authenticated
    if (!account || !account.jwtToken) {
      console.log("No authenticated user, skipping socket connection");
      return;
    }

    // Initialize Socket.IO connection with JWT authentication
    const socket: Socket = io(SOCKET_URL, {
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
      onNewOrder(newOrder);
    });

    // Listen for order updates (only admins will receive this)
    socket.on("orderUpdated", (updatedOrder: Order) => {
      console.log("Order updated:", updatedOrder);
      onOrderUpdated(updatedOrder);
    });

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, [account?.jwtToken, onNewOrder, onOrderUpdated]); // Re-connect if token changes
};
