import React from "react";
import { useCart } from "../../context/CartContext";

export const CartButton: React.FC = () => {
  const { cart, openCart } = useCart();

  if (cart.totalItems === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-white shadow-xl transition-all hover:scale-110 hover:bg-brand-600 active:scale-95"
      title="View Cart"
    >
      <div className="relative">
        <svg
          className="h-7 w-7"
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
        {cart.totalItems > 0 && (
          <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-brand-600">
            {cart.totalItems > 9 ? "9+" : cart.totalItems}
          </span>
        )}
      </div>
    </button>
  );
};
