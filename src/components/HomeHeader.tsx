import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

export default function HomeHeader() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* Left side: Brand and Location */}
        <View style={styles.textContainer}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/icon.png')}
              style={styles.brandIcon}
            />
            <Text style={styles.brandName}>CRAVELY</Text>
          </View>

          {/* <TouchableOpacity style={styles.locationRow}>
            <Text style={styles.subtitle}>Delivering to</Text>
            <Ionicons name="chevron-down" size={14} color={Colors.light.primary} style={styles.chevronIcon} />
          </TouchableOpacity> 
          <Text style={styles.addressText}>123 Lekki Phase 1, Lagos</Text> */}
        </View>

        {/* Right side: Actions */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.light.text} />
            <View style={styles.badge} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} activeOpacity={0.8}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: Typography.sizes.small,
    color: '#888',
    fontWeight: '600',
  },
  chevronIcon: {
    marginLeft: 4,
  },
  addressText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#F5F5F5',
  },
});
