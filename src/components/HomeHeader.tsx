import React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAddresses, useProfile } from '../hooks/queries';
import { makeStyles, useTheme } from '../theme';
import { Text } from '../ui';

export function avatarUrlFor(name: string | undefined, avatarUrl?: string | null) {
  if (avatarUrl) return avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=FF5A5F&color=fff&size=200&bold=true`;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeHeader() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const { data: profile } = useProfile();
  const { data: addresses } = useAddresses();
  const address = addresses?.find((a) => a.isDefault) ?? addresses?.[0];
  const firstName = profile?.fullName.split(' ')[0];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.location}
          onPress={() => router.push(address ? '/user-profile/addresses' : '/user-profile/address-new')}
          accessibilityRole="button"
          accessibilityLabel={address ? `Delivering to ${address.line1}. Change address` : 'Add a delivery address'}
        >
          <View style={styles.pin}>
            <Ionicons name="location" size={16} color={t.colors.primary} />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text variant="overline" tone="muted">
              Deliver to
            </Text>
            <View style={styles.addressRow}>
              <Text variant="bodyStrong" numberOfLines={1} style={{ flexShrink: 1 }}>
                {address ? `${address.line1}, ${address.city}` : 'Add delivery address'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={t.colors.text} />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push('/user-profile')} accessibilityLabel="Open profile" hitSlop={6}>
          <Image source={{ uri: avatarUrlFor(profile?.fullName, profile?.avatarUrl) }} style={styles.avatar} transition={200} />
        </Pressable>
      </View>

      <Text variant="display" style={styles.headline}>
        {greeting()}
        {firstName ? `, ${firstName}` : ''}!{'\n'}
        <Text variant="display" tone="primary">
          What are you craving?
        </Text>
      </Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: { paddingHorizontal: t.spacing.xl, paddingTop: t.spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: t.spacing.md },
  location: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm, flexShrink: 1 },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: t.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: t.colors.skeleton },
  headline: { marginTop: t.spacing.xl },
}));
