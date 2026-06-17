import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { Product } from "../../types/product";
import { useCart } from "../../context/CartContext";

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const imageUrl = `${API_URL}${product.image_url}`;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
    setQuantity(1);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const price = Number(product.price);
  const totalPrice = price * quantity;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl mx-4">
      <div className="flex flex-col md:flex-row overflow-hidden rounded-3xl">
        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-100 dark:bg-gray-900">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover rounded-l-3xl"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder-food.jpg";
            }}
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block rounded-md bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-600 dark:bg-brand-500/15 dark:text-brand-400">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h2 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            {product.name}
          </h2>

          {/* Rating */}
          <div className="mb-4 flex items-center">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4
                      ? "fill-yellow-500"
                      : "fill-gray-300 dark:fill-gray-600"
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
              4.5/5 <span className="text-gray-400">(128 reviews)</span>
            </span>
          </div>

          {/* Description */}
          <p className="mb-6 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
            {product.description}
          </p>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-brand-600 dark:text-brand-500">
                P{price.toFixed(2)}
              </span>
              {quantity > 1 && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  × {quantity} = P{totalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Spicy
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Bestseller
            </span>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {product.category}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-700 transition-colors hover:border-brand-500 hover:text-brand-500 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:text-brand-500"
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
                    d="M20 12H4"
                  />
                </svg>
              </button>

              <span className="w-12 text-center text-xl font-bold text-gray-900 dark:text-white">
                {quantity}
              </span>

              <button
                onClick={incrementQuantity}
                className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-700 transition-colors hover:border-brand-500 hover:text-brand-500 dark:border-gray-600 dark:text-gray-300 dark:hover:border-brand-500 dark:hover:text-brand-500"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>

              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                portion
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.is_available}
            className={`w-full rounded-lg px-6 py-4 text-center text-base font-semibold text-white transition-all ${
              product.is_available
                ? "bg-brand-500 hover:bg-brand-600 active:scale-98"
                : "cursor-not-allowed bg-gray-400"
            }`}
          >
            <div className="flex items-center justify-center gap-2">
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
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {product.is_available ? "Add to Cart" : "Unavailable"}
            </div>
          </button>
        </div>
      </div>
    </Modal>
  );
};
