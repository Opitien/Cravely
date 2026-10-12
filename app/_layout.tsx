import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useRouter, ErrorBoundaryProps } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { CartProvider, useCart } from '../src/context/CartContext';
import { useOrdersRealtime } from '../src/hooks/queries';
import Colors from '../src/constants/Colors';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,
    },
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <StatusBar style="dark" />
            <RootNavigator />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const router = useRouter();
  const { session, isLoading, isPasswordRecovery } = useAuth();
  const { isLoaded: cartLoaded } = useCart();
  const isSignedIn = !!session;

  useOrdersRealtime();

  // Opened a password-reset email link → go straight to "choose a new password".
  useEffect(() => {
    if (isSignedIn && isPasswordRecovery) {
      router.push('/user-profile/change-password');
    }
  }, [isSignedIn, isPasswordRecovery, router]);

  if (isLoading || !cartLoaded) {
    return <Splash />;
  }

  return (
    <Stack screenOptions={{ headerTintColor: Colors.light.primary, headerBackTitle: 'Back' }}>
      {/* Signed-in area. If the session disappears, expo-router redirects to the auth screens. */}
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="restaurant/[id]" options={{ title: '' }} />
        <Stack.Screen name="checkout/index" options={{ title: 'Checkout' }} />
        <Stack.Screen name="checkout/payment" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="checkout/success" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="checkout/callback" options={{ headerShown: false }} />
        <Stack.Screen name="orders/[id]" options={{ title: 'Order details' }} />
        <Stack.Screen name="user-profile/index" options={{ headerShown: false }} />
        <Stack.Screen name="user-profile/edit" options={{ title: 'Edit profile' }} />
        <Stack.Screen name="user-profile/addresses" options={{ title: 'Delivery addresses' }} />
        <Stack.Screen name="user-profile/address-new" options={{ title: 'New address', presentation: 'modal' }} />
        <Stack.Screen name="user-profile/change-password" options={{ title: 'Change password' }} />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot-password" options={{ title: 'Reset password' }} />
      </Stack.Protected>

      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}

function Splash() {
  return (
    <View style={styles.splash}>
      <Image source={require('../assets/icon.png')} style={styles.splashLogo} />
      <ActivityIndicator color="white" style={{ marginTop: 24 }} />
    </View>
  );
}

// Shown instead of a white screen if any screen throws while rendering.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Unhandled render error', error);
  }, [error]);

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorEmoji}>😵</Text>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>An unexpected error occurred. Please try again.</Text>
      <TouchableOpacity style={styles.errorButton} onPress={retry}>
        <Text style={styles.errorButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: Colors.light.brandDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 120,
    height: 120,
    borderRadius: 24,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'white',
  },
  errorEmoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 15,
    color: Colors.light.textMuted,
    textAlign: 'center',
  },
  errorButton: {
    marginTop: 24,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  errorButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
});
