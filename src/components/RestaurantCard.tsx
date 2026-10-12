import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { Restaurant } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { useFavorites } from '../hooks/queries';
import { formatDeliveryTime, formatNaira } from '../lib/format';
import { Ionicons } from '@expo/vector-icons';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export default function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(restaurant.id);

  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button" accessibilityLabel={restaurant.name}>
      <Image
        source={{ uri: restaurant.imageUrl }}
        style={[styles.image, !restaurant.isOpen && styles.imageClosed]}
      />

      {!restaurant.isOpen && (
        <View style={styles.closedBadge}>
          <Text style={styles.closedText}>Closed</Text>
        </View>
      )}

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
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" style={styles.star} />
            <Text style={styles.rating}>{restaurant.rating.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.category}>{restaurant.cuisine}</Text>

        <View style={styles.footerRow}>
          <Ionicons name="time-outline" size={14} color="#888" style={{ marginRight: 4 }} />
          <Text style={styles.footerText}>
            {formatDeliveryTime(restaurant.deliveryMinMinutes, restaurant.deliveryMaxMinutes)}
          </Text>
          <Text style={styles.footerText}>  •  </Text>
          <Ionicons name="bicycle-outline" size={16} color="#888" style={{ marginRight: 4 }} />
          <Text style={styles.footerText}>
            {restaurant.deliveryFee === 0 ? 'Free' : formatNaira(restaurant.deliveryFee)}
          </Text>
        </View>
        {restaurant.deliveryFee === 0 && (
          <View style={styles.freeDeliveryBadge}>
            <Ionicons name="sparkles" size={12} color="#22C55E" style={{ marginRight: 4 }} />
            <Text style={{ color: '#22C55E', fontWeight: 'bold', fontSize: 12 }}>
              Free Delivery
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    marginBottom: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  imageClosed: {
    opacity: 0.5,
  },
  closedBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  closedText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
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
  infoContainer: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    marginRight: 8,
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  star: {
    marginRight: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: Typography.weights.bold,
  },
  category: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
  },
  freeDeliveryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
});
