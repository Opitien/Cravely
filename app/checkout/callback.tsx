import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { LoadingState } from '../../src/ui';

// On web, Paystack redirects the checkout popup here; this hands the result back to the opener.
WebBrowser.maybeCompleteAuthSession();

/**
 * Paystack's redirect target. On native, openAuthSessionAsync usually intercepts the
 * redirect before this route mounts; if the router does open it, return to the payment screen,
 * which verifies the payment with the server.
 */
export default function PaymentCallback() {
  const router = useRouter();

  useEffect(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/orders');
    }
  }, [router]);

  return <LoadingState />;
}
