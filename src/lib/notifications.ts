/**
 * Push notifications (expo-notifications).
 *
 * - registerForPushAsync(): asks permission, creates the Android "orders" channel, returns the Expo push token.
 * - The token is stored per device in public.push_tokens (see api.savePushToken); a database trigger sends a push
 *   through the Expo Push API whenever one of the user's orders changes status.
 * - Taps on a notification deep-link to /orders/<id> (handled in app/_layout.tsx via useNotificationNavigation).
 */
import { useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';

export const ORDERS_CHANNEL_ID = 'orders';

// Show notifications as banners even while the app is in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export type PushRegistration =
  | { status: 'ok'; token: string }
  | { status: 'denied' | 'unsupported' | 'error'; reason: string };

export async function registerForPushAsync(): Promise<PushRegistration> {
  if (Platform.OS === 'web') return { status: 'unsupported', reason: 'Web push is not configured.' };
  if (!Device.isDevice) return { status: 'unsupported', reason: 'Push notifications need a physical device.' };

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(ORDERS_CHANNEL_ID, {
      name: 'Order updates',
      description: 'Live status of your Cravely orders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF5A5F',
      sound: 'default',
    });
  }

  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted || current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  if (!granted && current.canAskAgain) {
    const asked = await Notifications.requestPermissionsAsync({
      ios: { allowAlert: true, allowBadge: true, allowSound: true },
    });
    granted = asked.granted || asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
  }
  if (!granted) return { status: 'denied', reason: 'Notifications are turned off for Cravely in system settings.' };

  try {
    const projectId: string | undefined =
      Constants.expoConfig?.extra?.eas?.projectId ?? (Constants as any).easConfig?.projectId;
    const { data: token } = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
    return { status: 'ok', token };
  } catch (e) {
    // Typical on an Android build without Firebase (google-services.json) configured.
    return { status: 'error', reason: (e as Error).message };
  }
}

/** Opens the order screen when the user taps a notification (cold start included). */
export function useNotificationNavigation(enabled: boolean) {
  const router = useRouter();
  useEffect(() => {
    if (!enabled) return;
    const open = (response: Notifications.NotificationResponse | null | undefined) => {
      const data = response?.notification.request.content.data as { orderId?: string; url?: string } | undefined;
      if (data?.orderId) router.push(`/orders/${data.orderId}`);
      else if (typeof data?.url === 'string') router.push(data.url as any);
    };
    Notifications.getLastNotificationResponseAsync().then(open).catch(() => undefined);
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, [enabled, router]);
}

export function deviceLabel() {
  return [Device.manufacturer, Device.modelName].filter(Boolean).join(' ') || Platform.OS;
}
