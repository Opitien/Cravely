// Extends app.json. Kept as code so optional native config (Firebase for Android push) is only
// referenced when the file actually exists — EAS fails the build if googleServicesFile points nowhere.
const fs = require('fs');
const path = require('path');

const googleServices = path.join(__dirname, 'google-services.json');
const hasGoogleServices = fs.existsSync(googleServices);

module.exports = ({ config }) => ({
  ...config,
  android: {
    ...config.android,
    ...(hasGoogleServices ? { googleServicesFile: './google-services.json' } : {}),
    permissions: [
      ...(config.android?.permissions ?? []),
      'ACCESS_COARSE_LOCATION',
      'ACCESS_FINE_LOCATION',
      'POST_NOTIFICATIONS',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
    ],
  },
  ios: {
    ...config.ios,
    infoPlist: {
      ...config.ios?.infoPlist,
      NSLocationWhenInUseUsageDescription:
        'Cravely uses your location to pin your delivery address and show nearby restaurants.',
      UIBackgroundModes: ['remote-notification'],
    },
  },
  plugins: [
    ...config.plugins.filter((p) => (Array.isArray(p) ? p[0] : p) !== 'expo-notifications' && (Array.isArray(p) ? p[0] : p) !== 'expo-location'),
    [
      'expo-location',
      {
        locationWhenInUsePermission: 'Cravely uses your location to pin your delivery address and show nearby restaurants.',
        isAndroidBackgroundLocationEnabled: false,
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#FF5A5F',
        defaultChannel: 'orders',
        enableBackgroundRemoteNotifications: false,
      },
    ],
  ],
});
