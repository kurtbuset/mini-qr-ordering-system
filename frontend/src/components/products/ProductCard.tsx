import React, { useState } from "react";
import { Product } from "../../types/product";
import { ProductDetailModal } from "./ProductDetailModal";

interface ProductCardProps {
  product: Product;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setIsModalOpen(true);
  };

  const imageUrl = `${API_URL}${product.image_url}`;

  return (
    <>
      <div
        onClick={handleCardClick}
        className="cursor-pointer rounded-xl bg-white shadow-md dark:bg-gray-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      >
        {/* Product Image */}
        <div className="relative h-48 w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
          <img
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/images/placeholder-food.jpg";
            }}
          />
          {!product.is_available && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                Unavailable
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-brand-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
              <svg
                className="mr-1 h-3 w-3 fill-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Hot
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">
              {product.category}
            </span>
          </div>
          <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white line-clamp-1">
            {product.name}
          </h3>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>

          {/* Price and Action */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-brand-600">
                P{Number(product.price).toFixed(2)}
              </span>
              <div className="flex items-center text-xs text-yellow-500">
                <svg className="mr-1 h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-medium">(128)</span>
              </div>
            </div>

            <button
              onClick={handleButtonClick}
              disabled={!product.is_available}
              className={`flex h-12 w-12 items-center justify-center rounded-full transition-all ${
                product.is_available
                  ? "bg-brand-500 hover:bg-brand-600 active:scale-95"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              title="View details"
            >
              <svg
                className="h-6 w-6 fill-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 5v14m-7-7h14"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={product}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
