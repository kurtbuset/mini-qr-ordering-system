import { useState, useEffect } from "react";
import PageMeta from "../../components/common/PageMeta";
import { ProductCard } from "../../components/products/ProductCard";
import { CartButton } from "../../components/cart/CartButton";
import { CartModal } from "../../components/cart/CartModal";
import { productService } from "../../services/productService";
import {
  Product,
  ProductCategory,
  PRODUCT_CATEGORIES,
} from "../../types/product";

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>("All");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const getCategoryCount = (category: ProductCategory) => {
    if (category === "All") return products.length;
    return products.filter((p) => p.category === category).length;
  };

  return (
    <>
      <PageMeta
        title="Products | Mini QR Ordering System"
        description="Browse and manage menu items including burgers, hotdogs, and drinks"
      />

      <div className="mx-auto max-w-7xl p-3">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
            Our Menu
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover our delicious selection of food and beverages
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {PRODUCT_CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all ${
                  selectedCategory === category
                    ? "bg-brand-500 text-white shadow-lg"
                    : "bg-white text-gray-700 shadow hover:shadow-md dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
              >
                {category}
                <span className="ml-2 text-xs opacity-75">
                  ({getCategoryCount(category)})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
            <div className="flex items-center">
              <svg
                className="mr-3 h-6 w-6 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-300">
                  Error loading products
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              </div>
            </div>
            <button
              onClick={loadProducts}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
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
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  No products found in this category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Cart Button */}
      <CartButton />

      {/* Cart Modal */}
      <CartModal />
    </>
  );
}
