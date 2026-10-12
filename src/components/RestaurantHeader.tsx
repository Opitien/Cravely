import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { RestaurantWithMenu } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { useFavorites } from '../hooks/queries';
import { formatDeliveryTime, formatNaira } from '../lib/format';
import { Ionicons } from '@expo/vector-icons';

interface RestaurantHeaderProps {
  restaurant: RestaurantWithMenu;
}

// Hero image and key info at the top of the restaurant details screen
export default function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(restaurant.id);

  return (
    <View style={styles.container}>
      <Image source={{ uri: restaurant.imageUrl }} style={styles.heroImage} />
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => toggleFavorite(restaurant.id)}
        accessibilityLabel={favorited ? 'Remove from favourites' : 'Add to favourites'}
      >
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={22}
          color={favorited ? Colors.light.primary : 'white'}
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.category}>{restaurant.cuisine}</Text>

        {!restaurant.isOpen && (
          <View style={styles.closedBanner}>
            <Text style={styles.closedText}>
              This restaurant is closed right now. You can browse the menu, but ordering is unavailable.
            </Text>
          </View>
        )}

        <View style={styles.detailsRow}>
          <View style={styles.detailChip}>
            <Text style={styles.detailEmoji}>⭐</Text>
            <Text style={styles.detailText}>{restaurant.rating.toFixed(1)}</Text>
          </View>

          <View style={styles.detailChip}>
            <Text style={styles.detailEmoji}>🕒</Text>
            <Text style={styles.detailText}>
              {formatDeliveryTime(restaurant.deliveryMinMinutes, restaurant.deliveryMaxMinutes)}
            </Text>
          </View>

          <View style={styles.detailChip}>
            <Text style={styles.detailEmoji}>🚚</Text>
            <Text style={styles.detailText}>
              {restaurant.deliveryFee === 0 ? 'Free Delivery' : formatNaira(restaurant.deliveryFee)}
            </Text>
          </View>
        </View>

        {restaurant.minOrder > 0 && (
          <Text style={styles.minOrder}>Minimum order {formatNaira(restaurant.minOrder)}</Text>
        )}
      </View>

      <View style={styles.menuHeading}>
        <Text style={styles.menuTitle}>Menu ({restaurant.menu.length} items)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  heroImage: {
    width: '100%',
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
  closedBanner: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  closedText: {
    color: Colors.light.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  minOrder: {
    marginTop: 12,
    fontSize: 13,
    color: Colors.light.textMuted,
  },
  menuHeading: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  heartButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuTitle: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
});
