import React, { createContext, useState, useContext } from 'react';
import { CartItem } from '../types';

// --- Types ---

// The status an order can be in
export type OrderStatus = 'Preparing' | 'On the way' | 'Delivered';

// A single placed order
export interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  total: number;
  date: string;        // formatted date string e.g. "21 Aug 2025, 12:30"
  status: OrderStatus;
  paymentMethod: string;
}

interface OrdersContextType {
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((current) =>
      current.map((order) =>
        order.id === id
          ? { ...order, status }
          : order
      )
    );
  };

  /**
   * Called from the Checkout screen when the user taps "Place Order".
   * Creates a new order and adds it to the top of the history list.
   */
  const placeOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Date.now()}`,                    // Unique ID from timestamp
      date: new Date().toLocaleString('en-GB', {   // e.g. "21 Aug 2026, 14:30"
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'Preparing',                       // Every new order starts as "Preparing"
    };

    // Add to the FRONT of the list so newest orders appear first
    setOrders((current) => [newOrder, ...current]);


    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'On the way');
    }, 5000);

    setTimeout(() => {
      updateOrderStatus(newOrder.id, 'Delivered');
    }, 10000);
  };

  return (
    <OrdersContext.Provider value={{ orders, placeOrder, updateOrderStatus }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
