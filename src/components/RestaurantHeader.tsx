import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Restaurant } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';



// Get the screen width so the hero image fills the full width
const { width } = Dimensions.get('window');

interface RestaurantHeaderProps {
  restaurant: Restaurant;
}

// This component displays the restaurant's hero image and key info
// at the top of the details screen
export default function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  return (
    <View style={styles.container}>
      {/* Hero image - full width at the top */}
      <Image source={{ uri: restaurant.image }} style={styles.heroImage} />

      {/* Restaurant info section below the image */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.category}>{restaurant.category}</Text>

        {/* Row of quick info: rating, delivery time, fee */}
        <View style={styles.detailsRow}>
          <View style={styles.detailChip}>
            <Text style={styles.detailEmoji}>⭐</Text>
            <Text style={styles.detailText}>{restaurant.rating}</Text>
          </View>

          <View style={styles.detailChip}>
            <Text style={styles.detailEmoji}>🕒</Text>
            <Text style={styles.detailText}>{restaurant.deliveryTime}</Text>
          </View>

          <View style={styles.detailChip}>
            <Text style={styles.detailEmoji}>🚚</Text>
            <Text style={styles.detailText}>
              {restaurant.deliveryFee === 0
                ? 'Free Delivery'
                : `₦${restaurant.deliveryFee}`}
            </Text>
          </View>
        </View>
      </View>

      {/* Menu section heading */}
      <View style={styles.menuHeading}>
        <Text style={styles.menuTitle}>Menu ({restaurant.menu.length} items) </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  heroImage: {
    width: width,
    height: 220,
    backgroundColor: '#eee',
  },
  infoContainer: {
    padding: 16,
  },
  name: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  detailEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  detailText: {
    fontSize: 13,
    fontWeight: Typography.weights.medium,
    color: '#333',
  },
  menuHeading: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  menuTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
});
