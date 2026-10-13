import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem, CartRestaurant, MenuItem } from '../types';
import { useAuth } from './AuthContext';

const CART_STORAGE_KEY = '@cravely/cart';
const MAX_QUANTITY = 50; // matches the server-side limit in place_order

interface CartState {
  restaurant: CartRestaurant | null;
  items: CartItem[];
}

type AddResult = 'added' | 'different_restaurant';

interface CartContextType extends CartState {
  isLoaded: boolean;
  /** Returns 'different_restaurant' instead of adding when the cart holds another restaurant's items. */
  addToCart: (item: MenuItem, restaurant: CartRestaurant) => AddResult;
  /** Empties the cart and starts a new one with this item. */
  replaceCart: (item: MenuItem, restaurant: CartRestaurant) => void;
  /** Replaces the whole cart (used by "Reorder"). */
  loadCart: (restaurant: CartRestaurant, items: CartItem[]) => void;
  increaseQuantity: (menuItemId: string) => void;
  decreaseQuantity: (menuItemId: string) => void;
  removeItem: (menuItemId: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
  quantityOf: (menuItemId: string) => number;
}

const EMPTY: CartState = { restaurant: null, items: [] };

const CartContext = createContext<CartContextType | undefined>(undefined);

const toCartItem = (item: MenuItem): CartItem => ({
  menuItemId: item.id,
  name: item.name,
  price: item.price,
  imageUrl: item.imageUrl,
  quantity: 1,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const [cart, setCart] = useState<CartState>(EMPTY);
  const [isLoaded, setIsLoaded] = useState(false);
  const previousUserId = useRef<string | null | undefined>(undefined);

  // Load the saved cart once on startup
  useEffect(() => {
    AsyncStorage.getItem(CART_STORAGE_KEY)
      .then((stored) => {
        if (stored) setCart(JSON.parse(stored));
      })
      .catch((e) => console.warn('Failed to load cart', e))
      .finally(() => setIsLoaded(true));
  }, []);

  // Persist on every change (after the initial load so we don't overwrite it with an empty cart)
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)).catch((e) =>
      console.warn('Failed to save cart', e)
    );
  }, [cart, isLoaded]);

  // A cart belongs to whoever is signed in: empty it when the account changes or signs out.
  useEffect(() => {
    if (authLoading) return;
    const currentId = user?.id ?? null;
    if (previousUserId.current !== undefined && previousUserId.current !== currentId) {
      setCart(EMPTY);
    }
    previousUserId.current = currentId;
  }, [user?.id, authLoading]);

  const addToCart = (item: MenuItem, restaurant: CartRestaurant): AddResult => {
    if (cart.restaurant && cart.restaurant.id !== restaurant.id && cart.items.length > 0) {
      return 'different_restaurant';
    }
    setCart((current) => {
      const existing = current.items.find((i) => i.menuItemId === item.id);
      const items = existing
        ? current.items.map((i) =>
            i.menuItemId === item.id ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) } : i
          )
        : [...current.items, toCartItem(item)];
      return { restaurant, items };
    });
    return 'added';
  };

  const replaceCart = (item: MenuItem, restaurant: CartRestaurant) => {
    setCart({ restaurant, items: [toCartItem(item)] });
  };

  const loadCart = (restaurant: CartRestaurant, items: CartItem[]) => {
    setCart(items.length === 0 ? EMPTY : { restaurant, items });
  };

  const increaseQuantity = (menuItemId: string) => {
    setCart((current) => ({
      ...current,
      items: current.items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QUANTITY) } : i
      ),
    }));
  };

  const removeItem = (menuItemId: string) => {
    setCart((current) => {
      const items = current.items.filter((i) => i.menuItemId !== menuItemId);
      return items.length === 0 ? EMPTY : { ...current, items };
    });
  };

  const decreaseQuantity = (menuItemId: string) => {
    setCart((current) => {
      const items = current.items
        .map((i) => (i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i) => i.quantity > 0);
      return items.length === 0 ? EMPTY : { ...current, items };
    });
  };

  const clearCart = () => setCart(EMPTY);

  const subtotal = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
  const quantityOf = (menuItemId: string) => cart.items.find((i) => i.menuItemId === menuItemId)?.quantity ?? 0;

  return (
    <CartContext.Provider
      value={{
        ...cart,
        isLoaded,
        addToCart,
        replaceCart,
        loadCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        subtotal,
        totalItems,
        quantityOf,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
