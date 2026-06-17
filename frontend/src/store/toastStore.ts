import { create } from "zustand";

export interface Toast {
  id: string;
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  duration?: number; // in milliseconds, default 5000
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const duration = toast.duration ?? 5000;
    const newToast: Toast = {
      ...toast,
      id,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearAll: () => set({ toasts: [] }),
}));

// Helper functions for easy toast creation
export const toast = {
  success: (title: string, message: string, duration?: number) => {
    useToastStore
      .getState()
      .addToast({ variant: "success", title, message, duration });
  },
  error: (title: string, message: string, duration?: number) => {
    useToastStore
      .getState()
      .addToast({ variant: "error", title, message, duration });
  },
  warning: (title: string, message: string, duration?: number) => {
    useToastStore
      .getState()
      .addToast({ variant: "warning", title, message, duration });
  },
  info: (title: string, message: string, duration?: number) => {
    useToastStore
      .getState()
      .addToast({ variant: "info", title, message, duration });
  },
};
