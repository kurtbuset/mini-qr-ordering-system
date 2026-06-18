import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types/product";
import { CartItem, Cart } from "../types/cart";
import { toast } from "../store/toastStore";

interface CartContextType {
  cart: Cart;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "qr_ordering_cart";

const getStoredCart = (): Cart => {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { items: [], totalItems: 0, totalAmount: 0 };
    }
  }
  return { items: [], totalItems: 0, totalAmount: 0 };
};

const calculateTotals = (
  items: CartItem[],
): Pick<Cart, "totalItems" | "totalAmount"> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
  return { totalItems, totalAmount };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart>(getStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.items.findIndex(
        (item) => item.product.id === product.id,
      );
      const price = Number(product.price);
      let newItems: CartItem[];
      let message: string;

      if (existingIndex > -1) {
        // Update existing item
        newItems = prevCart.items.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * price,
              }
            : item,
        );
        message = `${product.name} quantity updated to ${newItems[existingIndex].quantity}`;
        toast.success("Updated in cart", message, 3000);
      } else {
        // Add new item
        newItems = [
          ...prevCart.items,
          { product, quantity, subtotal: price * quantity },
        ];
        message = `${quantity} × ${product.name}`;
        toast.success("Added to cart", message, 3000);
      }

      return { items: newItems, ...calculateTotals(newItems) };
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => {
      const removedItem = prevCart.items.find(
        (item) => item.product.id === productId,
      );
      const newItems = prevCart.items.filter(
        (item) => item.product.id !== productId,
      );

      if (removedItem) {
        toast.info(
          "Removed from cart",
          `${removedItem.product.name} removed`,
          3000,
        );
      }

      return { items: newItems, ...calculateTotals(newItems) };
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              subtotal: Number(item.product.price) * quantity,
            }
          : item,
      );

      return { items: newItems, ...calculateTotals(newItems) };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalAmount: 0 });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
