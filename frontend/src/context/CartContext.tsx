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

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<Cart>(() => {
    // Load cart from localStorage on init
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return { items: [], totalItems: 0, totalAmount: 0 };
      }
    }
    return { items: [], totalItems: 0, totalAmount: 0 };
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const calculateTotals = (
    items: CartItem[],
  ): { totalItems: number; totalAmount: number } => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
    return { totalItems, totalAmount };
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.id === product.id,
    );

    setCart((prevCart) => {
      let newItems: CartItem[];
      const price = Number(product.price);
      let isUpdate = false;
      let updatedQuantity = quantity;

      if (existingItemIndex > -1) {
        // Update existing item
        isUpdate = true;
        newItems = [...prevCart.items];
        const newQuantity = newItems[existingItemIndex].quantity + quantity;
        updatedQuantity = newQuantity;
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
          subtotal: newQuantity * price,
        };
      } else {
        // Add new item
        const newItem: CartItem = {
          product,
          quantity,
          subtotal: price * quantity,
        };
        newItems = [...prevCart.items, newItem];
      }

      const { totalItems, totalAmount } = calculateTotals(newItems);

      // Show toast notification after state update
      setTimeout(() => {
        if (isUpdate) {
          toast.success(
            "Updated in cart",
            `${product.name} quantity updated to ${updatedQuantity}`,
            3000,
          );
        } else {
          toast.success("Added to cart", `${quantity} × ${product.name}`, 3000);
        }
      }, 0);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    });
  };

  const removeFromCart = (productId: number) => {
    // Get product name before removing
    const removedItem = cart.items.find(
      (item) => item.product.id === productId,
    );

    setCart((prevCart) => {
      const newItems = prevCart.items.filter(
        (item) => item.product.id !== productId,
      );
      const { totalItems, totalAmount } = calculateTotals(newItems);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    });

    // Show toast notification
    if (removedItem) {
      toast.info(
        "Removed from cart",
        `${removedItem.product.name} removed`,
        3000,
      );
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) => {
      const newItems = prevCart.items.map((item) => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
            subtotal: Number(item.product.price) * quantity,
          };
        }
        return item;
      });

      const { totalItems, totalAmount } = calculateTotals(newItems);

      return {
        items: newItems,
        totalItems,
        totalAmount,
      };
    });
  };

  const clearCart = () => {
    setCart({ items: [], totalItems: 0, totalAmount: 0 });
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
