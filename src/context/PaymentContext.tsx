import React, { createContext, useState, useContext } from 'react';

// A saved card object
export interface SavedCard {
  id: string;
  last4: string;       // last 4 digits, e.g. "4242"
  brand: string;       // e.g. "Visa", "Mastercard"
  expiry: string;      // e.g. "12/27"
  holderName: string;
}

interface PaymentContextType {
  savedCards: SavedCard[];
  activeCardId: string | null;
  addCard: (card: Omit<SavedCard, 'id'>) => void;
  removeCard: (id: string) => void;
  setActiveCard: (id: string) => void;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export function PaymentProvider({ children }: { children: React.ReactNode }) {
  // Pre-load one demo card so the screen isn't empty on first use
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: 'card-demo-1',
      last4: '4242',
      brand: 'Visa',
      expiry: '12/27',
      holderName: 'Opitien E.',
    },
  ]);
  const [activeCardId, setActiveCardId] = useState<string | null>('card-demo-1');

  const addCard = (cardData: Omit<SavedCard, 'id'>) => {
    const newCard: SavedCard = {
      ...cardData,
      id: `card-${Date.now()}`,
    };
    setSavedCards((prev) => [...prev, newCard]);
    setActiveCardId(newCard.id); // Auto-select the newly added card
  };

  const removeCard = (id: string) => {
    setSavedCards((prev) => prev.filter((c) => c.id !== id));
    // If the removed card was active, clear the selection
    setActiveCardId((prev) => (prev === id ? null : prev));
  };

  const setActiveCard = (id: string) => {
    setActiveCardId(id);
  };

  return (
    <PaymentContext.Provider value={{ savedCards, activeCardId, addCard, removeCard, setActiveCard }}>
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayment() {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
}
