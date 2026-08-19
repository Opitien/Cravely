import React, { createContext, useState, useContext } from 'react';
import { MenuItem, CartItem, Restaurant } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: MenuItem, restaurant: Restaurant) => void;
  removeFromCart: (itemId: string) => void;
  increaseQuantity: (itemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  totalItems: number;
}

// 1. Create the Context (the "cloud" that holds our data)
const CartContext = createContext<CartContextType | undefined>(undefined);

// 2. Create a Provider component that wraps our app
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Calculate totals whenever `items` changes
  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (menuItem: MenuItem, restaurant: Restaurant) => {
    setItems((currentItems) => {
      // Check if the item is already in the cart
      const existingItem = currentItems.find((item) => item.id === menuItem.id);

      if (existingItem) {
        // If it exists, increase the quantity
        return currentItems.map((item) =>
          item.id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // If it's a new item, add it with quantity 1
      const newItem: CartItem = {
        ...menuItem,
        quantity: 1,
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
      };

      return [...currentItems, newItem];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === itemId);

      if (existingItem && existingItem.quantity > 1) {
        // Decrease quantity if more than 1
        return currentItems.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }

      // Remove item entirely if quantity is 1
      return currentItems.filter((item) => item.id !== itemId);
    });
  };

  const increaseQuantity = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        increaseQuantity,
        clearCart,
        cartTotal,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// 3. Create a custom hook to make accessing the context easier
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
