import React, { useEffect, useMemo } from 'react';
import { View, Image, ActivityIndicator, Platform } from 'react-native';
import { Stack, useRouter, ErrorBoundaryProps, ThemeProvider, DarkTheme, DefaultTheme } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { CartProvider, useCart } from '../src/context/CartContext';
import { useOrdersRealtime, usePushRegistration } from '../src/hooks/queries';
import { useNotificationNavigation } from '../src/lib/notifications';
import { useTheme } from '../src/theme';
import { EmptyState } from '../src/ui';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30 * 1000,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <ThemedNavigation fontsReady={fontsLoaded || !!fontError} />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

function ThemedNavigation({ fontsReady }: { fontsReady: boolean }) {
  const t = useTheme();

  // Make React Navigation's headers, tab bar and backgrounds use our palette.
  const navigationTheme = useMemo(() => {
    const base = t.dark ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: t.colors.primary,
        background: t.colors.background,
        card: t.colors.surface,
        text: t.colors.text,
        border: t.colors.border,
        notification: t.colors.primary,
      },
    };
  }, [t]);

  return (
    <ThemeProvider value={navigationTheme}>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <RootNavigator fontsReady={fontsReady} />
    </ThemeProvider>
  );
}

function RootNavigator({ fontsReady }: { fontsReady: boolean }) {
  const t = useTheme();
  const router = useRouter();
  const { session, isLoading, isPasswordRecovery } = useAuth();
  const { isLoaded: cartLoaded } = useCart();
  const isSignedIn = !!session;

  useOrdersRealtime();
  // Register this phone for order-status pushes while signed in; open the order when a notification is tapped.
  usePushRegistration();
  useNotificationNavigation(isSignedIn);

  // Opened a password-reset email link → go straight to "choose a new password".
  useEffect(() => {
    if (isSignedIn && isPasswordRecovery) {
      router.push('/user-profile/change-password');
    }
  }, [isSignedIn, isPasswordRecovery, router]);

  if (isLoading || !cartLoaded || !fontsReady) {
    return <Splash />;
  }

  return (
    <Stack
      screenOptions={{
        // iOS: translucent system-material header; Android/web: flat grouped background.
        headerTintColor: t.colors.primary,
        headerTitleStyle: { ...t.type.headline, color: t.colors.label },
        headerLargeTitleStyle: { ...t.type.largeTitle, color: t.colors.label },
        headerShadowVisible: false,
        headerStyle: { backgroundColor: t.colors.groupedBackground },
        headerBackButtonDisplayMode: 'minimal',
        contentStyle: { backgroundColor: t.colors.groupedBackground },
        animation: Platform.OS === 'ios' ? 'default' : 'slide_from_right',
      }}
    >
      {/* Signed-in area. If the session disappears, expo-router redirects to the auth screens. */}
      <Stack.Protected guard={isSignedIn}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="restaurant/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="checkout/index" options={{ title: 'Checkout' }} />
        <Stack.Screen name="checkout/payment" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="checkout/success" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="checkout/callback" options={{ headerShown: false }} />
        <Stack.Screen name="orders/[id]" options={{ title: 'Order details' }} />
        <Stack.Screen name="user-profile/index" options={{ title: 'Profile' }} />
        <Stack.Screen name="user-profile/edit" options={{ title: 'Edit profile' }} />
        <Stack.Screen name="user-profile/addresses" options={{ title: 'Delivery addresses' }} />
        <Stack.Screen name="user-profile/address-new" options={{ title: 'New address', presentation: 'modal' }} />
        <Stack.Screen name="user-profile/change-password" options={{ title: 'Change password' }} />
      </Stack.Protected>

      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="auth/forgot-password" options={{ title: '' }} />
      </Stack.Protected>

      <Stack.Screen name="+not-found" options={{ title: 'Not found' }} />
    </Stack>
  );
}

function Splash() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.colors.brand, alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('../assets/icon.png')} style={{ width: 120, height: 120, borderRadius: 28 }} />
      <ActivityIndicator color="#FFFFFF" style={{ marginTop: 28 }} />
    </View>
  );
}

// Shown instead of a white screen if any screen throws while rendering.
export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Unhandled render error', error);
  }, [error]);

  return (
    <EmptyState
      emoji="😵"
      title="Something went wrong"
      subtitle="An unexpected error occurred. Please try again."
      actionLabel="Try again"
      onAction={retry}
    />
  );
}
