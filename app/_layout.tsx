import { Stack } from 'expo-router';
import { CartProvider } from '../src/context/CartContext';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { AuthProvider } from '../src/context/AuthContext';
import { OrdersProvider } from '../src/context/OrdersContext';
import { PaymentProvider } from '../src/context/PaymentContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <OrdersProvider>
          <PaymentProvider>
            <CartProvider>
          <Stack>
            {/* Main app tabs */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            {/* Auth screens — no header */}
            <Stack.Screen name="auth/login" options={{ headerShown: false }} />
            <Stack.Screen name="auth/signup" options={{ headerShown: false }} />

            {/* User profile screen */}
            <Stack.Screen
              name="user-profile/index"
              options={{ headerShown: false }}
            />

            {/* Restaurant details */}
            <Stack.Screen
              name="restaurant/[id]"
              options={{ title: 'Restaurant Details' }}
            />

            {/* Checkout flow */}
            <Stack.Screen name="checkout/index" options={{ title: 'Checkout' }} />
            <Stack.Screen
              name="checkout/processing"
              options={{ headerShown: false, gestureEnabled: false }}
            />
            <Stack.Screen
              name="checkout/success"
              options={{
                headerShown: false,
                gestureEnabled: false,
              }}
            />

            {/* User profile screens */}
            <Stack.Screen
              name="user-profile/cards"
              options={{ headerShown: false }}
            />

            <Stack.Screen name="+not-found" />
          </Stack>
            </CartProvider>
          </PaymentProvider>
        </OrdersProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}
