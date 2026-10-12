import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../src/context/AuthContext';
import { useAddresses, useFavorites, useOrders, useProfile } from '../../src/hooks/queries';
import { deleteAccount } from '../../src/services/api';
import { avatarUrlFor } from '../../src/components/HomeHeader';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';
import Links from '../../src/constants/Links';
import { getErrorMessage } from '../../src/lib/format';

function ProfileMenuItem({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7} accessibilityRole="button">
      <View style={[styles.menuIconWrap, danger && styles.menuIconWrapDanger]}>
        <Ionicons name={icon} size={20} color={danger ? Colors.light.primary : '#555'} />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {value ? <Text style={styles.menuValue} numberOfLines={1}>{value}</Text> : null}
      {!danger && <Ionicons name="chevron-forward" size={16} color="#ccc" />}
    </TouchableOpacity>
  );
}

export default function UserProfileScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { favoriteIds } = useFavorites();
  const { data: orders } = useOrders();
  const { data: addresses } = useAddresses();

  const removeAccount = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => signOut().catch(() => undefined),
    onError: (e) => Alert.alert('Could not delete account', getErrorMessage(e)),
  });

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        // The auth guard sends us back to the login screen once the session is gone.
        onPress: () => signOut().catch((e) => Alert.alert('Could not log out', getErrorMessage(e))),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account?',
      'This permanently deletes your account, saved addresses, favourites and order history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeAccount.mutate() },
      ]
    );
  };

  const defaultAddress = addresses?.find((a) => a.isDefault) ?? addresses?.[0];
  const name = profile?.fullName || user?.email?.split('@')[0] || '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()} accessibilityLabel="Go back">
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <Image source={{ uri: avatarUrlFor(name, profile?.avatarUrl) }} style={styles.avatar} />
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {profile?.phone ? <Text style={styles.userEmail}>{profile.phone}</Text> : null}
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{favoriteIds.length}</Text>
            <Text style={styles.statLabel}>Favourites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{orders?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{addresses?.length ?? 0}</Text>
            <Text style={styles.statLabel}>Addresses</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <ProfileMenuItem icon="person-outline" label="Edit Profile" onPress={() => router.push('/user-profile/edit')} />
          <ProfileMenuItem
            icon="location-outline"
            label="Delivery Addresses"
            value={defaultAddress?.city}
            onPress={() => router.push('/user-profile/addresses')}
          />
          <ProfileMenuItem
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => router.push('/user-profile/change-password')}
          />
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuCard}>
          <ProfileMenuItem
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => Linking.openURL(`mailto:${Links.supportEmail}`)}
          />
          <ProfileMenuItem
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            onPress={() => WebBrowser.openBrowserAsync(Links.privacyPolicy)}
          />
          <ProfileMenuItem
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => WebBrowser.openBrowserAsync(Links.terms)}
          />
        </View>

        <View style={[styles.menuCard, { marginTop: 24 }]}>
          <ProfileMenuItem icon="log-out-outline" label="Log Out" onPress={handleLogout} danger />
          <ProfileMenuItem
            icon="trash-outline"
            label={removeAccount.isPending ? 'Deleting account…' : 'Delete Account'}
            onPress={removeAccount.isPending ? undefined : handleDeleteAccount}
            danger
          />
        </View>

        <Text style={styles.version}>Cravely v{Constants.expoConfig?.version ?? '1.0.0'}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: '#111',
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 28,
    backgroundColor: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.light.primary,
    marginBottom: 12,
  },
  userName: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: '#111',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: Typography.sizes.medium,
    color: '#888',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop: 12,
    marginHorizontal: 20,
    borderRadius: 24,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
  },
  statLabel: {
    fontSize: Typography.sizes.small,
    color: '#888',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEE',
    marginVertical: 4,
  },
  sectionTitle: {
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.bold,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 20,
  },
  menuCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconWrapDanger: {
    backgroundColor: '#FFF0F0',
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.sizes.medium,
    color: '#222',
  },
  menuLabelDanger: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
  },
  menuValue: {
    fontSize: Typography.sizes.small,
    color: '#999',
    marginRight: 8,
    maxWidth: 120,
  },
  version: {
    textAlign: 'center',
    color: '#BBB',
    fontSize: 12,
    marginVertical: 32,
  },
});
