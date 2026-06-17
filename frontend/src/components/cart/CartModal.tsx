import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { useCart } from "../../context/CartContext";
import { CartItem } from "../../types/cart";
import { OrderModal } from "../order/customer/OrderModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const CartModal: React.FC = () => {
  const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart } =
    useCart();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const handleProceedToCheckout = () => {
    closeCart();
    setIsOrderModalOpen(true);
  };

  return (
    <>
      <Modal isOpen={isCartOpen} onClose={closeCart} className="max-w-2xl mx-4">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Shopping Cart
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              {cart.totalItems} {cart.totalItems === 1 ? "item" : "items"} in
              your cart
            </p>
          </div>

          {/* Cart Items */}
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg
                className="mb-4 h-24 w-24 text-gray-300 dark:text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                Your cart is empty
              </p>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                Add some delicious items to get started
              </p>
            </div>
          ) : (
            <>
              <div className="max-h-96 space-y-4 overflow-y-auto">
                {cart.items.map((item: CartItem) => (
                  <CartItemRow
                    key={item.product.id}
                    item={item}
                    onQuantityChange={handleQuantityChange}
                    onRemove={handleRemoveItem}
                  />
                ))}
              </div>

              {/* Total Section */}
              <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-base font-medium text-gray-700 dark:text-gray-300 sm:text-lg">
                    Subtotal
                  </span>
                  <span className="text-base font-semibold text-gray-900 dark:text-white sm:text-lg">
                    P{cart.totalAmount.toFixed(2)}
                  </span>
                </div>

                <div className="mb-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                  <span className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
                    Total
                  </span>
                  <span className="text-xl font-bold text-brand-600 sm:text-2xl">
                    P{cart.totalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full rounded-lg bg-brand-500 px-6 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-brand-600 active:scale-98 sm:py-4 sm:text-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </>
  );
};

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onQuantityChange,
  onRemove,
}) => {
  const imageUrl = `${API_URL}${item.product.image_url}`;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700 sm:flex-row sm:items-center sm:gap-4 sm:p-4">
      {/* Top Row: Image, Info, Remove Button */}
      <div className="flex items-start gap-3 sm:flex-1 sm:items-center">
        {/* Product Image */}
        <img
          src={imageUrl}
          alt={item.product.name}
          className="h-16 w-16 flex-shrink-0 rounded-md object-cover sm:h-20 sm:w-20"
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-food.jpg";
          }}
        />

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {item.product.name}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            P{Number(item.product.price).toFixed(2)} each
          </p>
          {/* Mobile: Show subtotal here */}
          <p className="mt-1 text-base font-bold text-gray-900 dark:text-white sm:hidden">
            P{item.subtotal.toFixed(2)}
          </p>
        </div>

        {/* Remove Button - Top right on mobile */}
        <button
          onClick={() => onRemove(item.product.id)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md text-brand-500 transition-colors hover:bg-brand-50 dark:hover:bg-brand-900/20 sm:hidden"
          title="Remove item"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Bottom Row: Quantity Controls (Mobile) / Right Side (Desktop) */}
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        {/* decrement button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(item.product.id, item.quantity - 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            disabled={item.quantity <= 1}
          >
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
                d="M20 12H4"
              />
            </svg>
          </button>

          <span className="w-10 text-center text-base font-semibold text-gray-900 dark:text-white sm:w-8">
            {item.quantity}
          </span>

          {/* increment button */}
          <button
            onClick={() => onQuantityChange(item.product.id, item.quantity + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-600 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Desktop: Subtotal and Remove Button */}
        <div className="hidden items-center gap-3 sm:flex">
          <div className="w-24 text-right">
            <p className="font-bold text-gray-900 dark:text-white">
              P{item.subtotal.toFixed(2)}
            </p>
          </div>

          <button
            onClick={() => onRemove(item.product.id)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-brand-500 transition-colors hover:bg-brand-50 dark:hover:bg-brand-900/20"
            title="Remove item"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
