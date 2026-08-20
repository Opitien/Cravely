import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';
import { FavoritesProvider } from '../src/context/FavoritesContext';

// Root layout to handle main navigation stack
export default function RootLayout() {
  return (
    <FavoritesProvider>
      <CartProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
          <Stack.Screen name="restaurant/[id]" options={{ title: 'Restaurant Details' }} />
          <Stack.Screen name="checkout/index" options={{ title: 'Checkout' }} />
          <Stack.Screen 
            name="checkout/success" 
            options={{ 
              headerShown: false, 
              gestureEnabled: false // Prevent swiping back on iOS
            }} 
          />
        </Stack>
      </CartProvider>
    </FavoritesProvider>
  );
}
