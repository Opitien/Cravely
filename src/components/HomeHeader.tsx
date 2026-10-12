import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useProfile } from '../hooks/queries';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

export function avatarUrlFor(name: string | undefined, avatarUrl?: string | null) {
  if (avatarUrl) return avatarUrl;
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=FF5A5F&color=fff&size=200`;
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeHeader({ isScrolled = false }: { isScrolled?: boolean }) {
  const router = useRouter();
  const { data: profile } = useProfile();
  const firstName = profile?.fullName.split(' ')[0];

  return (
    <SafeAreaView style={[styles.safeArea, isScrolled && styles.safeAreaScrolled]} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <View style={styles.brandRow}>
            <Image source={require('../../assets/icon.png')} style={styles.brandIcon} />
            <Text style={styles.brandName}>Cravely</Text>
          </View>
          <Text style={styles.greetingText}>
            {greeting()}{firstName ? `, ${firstName}` : ''} 👋
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/user-profile')}
          activeOpacity={0.8}
          accessibilityLabel="Open profile"
        >
          <Image source={{ uri: avatarUrlFor(profile?.fullName, profile?.avatarUrl) }} style={styles.avatar} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#ffffff',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  safeAreaScrolled: {
    borderBottomColor: '#EAEAEA',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  textContainer: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
    letterSpacing: 1,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    marginRight: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
  greetingText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginTop: 4,
  },
});
