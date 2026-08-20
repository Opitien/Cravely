import React, { createContext, useState, useContext } from 'react';

interface FavoritesContextType {
  favoriteIds: string[];
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // Store an array of restaurant IDs that the user has favorited
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // If it's already a favorite, remove it. If it's not, add it!
  const toggleFavorite = (restaurantId: string) => {
    setFavoriteIds((currentIds) => {
      if (currentIds.includes(restaurantId)) {
        // Remove it by filtering it out
        return currentIds.filter((id) => id !== restaurantId);
      } else {
        // Add it to the array
        return [...currentIds, restaurantId];
      }
    });
  };

  // Helper function to quickly check if a restaurant is favorited
  const isFavorite = (restaurantId: string) => {
    return favoriteIds.includes(restaurantId);
  };

  // Clear all favorites at once
  const clearFavorites = () => {
    setFavoriteIds([]);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook to easily use this context in any component
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
