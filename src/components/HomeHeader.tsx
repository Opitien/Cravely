import React from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useAddresses, useProfile } from '../hooks/queries';
import { makeStyles, useTheme } from '../theme';
import { Icon, Pressable, Text, enter, useReduceMotion } from '../ui';

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

/** Compact iOS-style top bar (location pill + avatar) followed by a large-title greeting. */
export default function HomeHeader() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const reduce = useReduceMotion();
  const { data: profile } = useProfile();
  const { data: addresses } = useAddresses();
  const address = addresses?.find((a) => a.isDefault) ?? addresses?.[0];
  const firstName = profile?.fullName.split(' ')[0];

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.location}
          feedback="opacity"
          onPress={() => router.push(address ? '/user-profile/addresses' : '/user-profile/address-new')}
          accessibilityRole="button"
          accessibilityLabel={address ? `Delivering to ${address.line1}. Change address` : 'Add a delivery address'}
        >
          <View style={styles.pin}>
            <Icon name="location" size={14} color={t.colors.primary} weight="bold" />
          </View>
          <View style={{ flexShrink: 1 }}>
            <Text variant="caption2" tone="secondary" style={{ textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Deliver to
            </Text>
            <View style={styles.addressRow}>
              <Text variant="subheadlineStrong" numberOfLines={1} style={{ flexShrink: 1 }}>
                {address ? `${address.line1}, ${address.city}` : 'Add delivery address'}
              </Text>
              <Icon name="chevron-down" size={12} color={t.colors.secondaryLabel} weight="bold" />
            </View>
          </View>
        </Pressable>

        <Pressable onPress={() => router.push('/user-profile')} accessibilityLabel="Open profile" accessibilityRole="button" hitSlop={6} pressScale={0.92}>
          <Image source={{ uri: avatarUrlFor(profile?.fullName, profile?.avatarUrl) }} style={styles.avatar} transition={200} />
        </Pressable>
      </View>

      <MotiView {...enter(0, reduce)}>
        <Text variant="largeTitle" style={styles.headline}>
          {greeting()}
          {firstName ? `, ${firstName}` : ''}
        </Text>
        <Text variant="title2" tone="primary">
          What are you craving?
        </Text>
      </MotiView>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  container: { paddingHorizontal: t.spacing.lg, paddingTop: t.spacing.sm },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: t.spacing.md },
  location: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm, flexShrink: 1 },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: t.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: t.colors.skeleton },
  headline: { marginTop: t.spacing.xl },
}));
