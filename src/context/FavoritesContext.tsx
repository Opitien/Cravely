import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// The key we use to store data in the phone's storage
const FAVORITES_STORAGE_KEY = '@cravely/favorites';

interface FavoritesContextType {
  favoriteIds: string[];
  toggleFavorite: (restaurantId: string) => void;
  isFavorite: (restaurantId: string) => boolean;
  clearFavorites: () => void;
  isLoaded: boolean; // lets components know if we've loaded from storage yet
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  // We start as "not loaded" so the app knows to wait before rendering
  const [isLoaded, setIsLoaded] = useState(false);

  // 📖 LOAD: When the app starts, read saved favorites from the phone's storage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored !== null) {
          // stored is a JSON string like '["1","3","7"]' — parse it back to an array
          setFavoriteIds(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Failed to load favorites from storage:', e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadFavorites();
  }, []); // Empty array = run once on mount

  // 💾 SAVE: Every time favoriteIds changes (AND after initial load), save to storage
  useEffect(() => {
    if (!isLoaded) return; // Don't save until we've loaded (avoid overwriting with empty [])

    const saveFavorites = async () => {
      try {
        // Convert the array to a JSON string for storage
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteIds));
      } catch (e) {
        console.warn('Failed to save favorites to storage:', e);
      }
    };

    saveFavorites();
  }, [favoriteIds, isLoaded]);

  // If it's already a favorite, remove it. If it's not, add it!
  const toggleFavorite = (restaurantId: string) => {
    setFavoriteIds((currentIds) => {
      if (currentIds.includes(restaurantId)) {
        return currentIds.filter((id) => id !== restaurantId);
      } else {
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
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isFavorite, clearFavorites, isLoaded }}>
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
