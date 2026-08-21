import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useFavorites } from '../../src/context/FavoritesContext';
import { useCart } from '../../src/context/CartContext';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';

// A reusable row for the settings-style menu
function ProfileMenuItem({
  icon,
  label,
  value,
  onPress,
  danger,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.menuIconWrap, danger && styles.menuIconWrapDanger]}>
        <Ionicons
          name={icon as any}
          size={20}
          color={danger ? Colors.light.primary : '#555'}
        />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      {!danger && <Ionicons name="chevron-forward" size={16} color="#ccc" />}
    </TouchableOpacity>
  );
}

export default function UserProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { favoriteIds } = useFavorites();
  const { totalItems } = useCart();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => {
          logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header with back button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Avatar + Name */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color="white" />
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{favoriteIds.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalItems}</Text>
            <Text style={styles.statLabel}>In Cart</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <ProfileMenuItem icon="person-outline" label="Edit Profile" onPress={() => Alert.alert('Coming soon!', 'Edit profile will be available in a future update.')} />
          <ProfileMenuItem icon="location-outline" label="Delivery Address" value="Lagos" onPress={() => Alert.alert('Coming soon!')} />
          <ProfileMenuItem icon="card-outline" label="Saved Cards" onPress={() => router.push('/user-profile/cards')} />
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuCard}>
          <ProfileMenuItem icon="notifications-outline" label="Notifications" onPress={() => Alert.alert('Coming soon!')} />
          <ProfileMenuItem icon="shield-checkmark-outline" label="Privacy & Security" onPress={() => Alert.alert('Coming soon!')} />
          <ProfileMenuItem icon="help-circle-outline" label="Help & Support" onPress={() => Alert.alert('Coming soon!')} />
        </View>

        {/* Logout */}
        <View style={[styles.menuCard, { marginTop: 8 }]}>
          <ProfileMenuItem icon="log-out-outline" label="Log Out" onPress={handleLogout} danger />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
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
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
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
    backgroundColor: 'white',
    marginTop: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
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
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
  },
});
