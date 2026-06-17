import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";

/**
 * Hook to initialize authentication on app mount
 * Call this once at the root of your app
 */
export const useAuthInit = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitialized = useAuthStore((state) => state.isInitialized);

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);
};
