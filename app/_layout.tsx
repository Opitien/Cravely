import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';

// Root layout to handle main navigation stack
export default function RootLayout() {
  return (
    <CartProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="restaurant/[id]" options={{ title: 'Restaurant Details' }} />
        <Stack.Screen name="checkout/index" options={{ title: 'Checkout' }} />
      </Stack>
    </CartProvider>
  );
}
