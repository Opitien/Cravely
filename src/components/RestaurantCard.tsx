import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { Restaurant } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { useFavorites } from '../context/FavoritesContext';
import { Ionicons } from '@expo/vector-icons';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

export default function RestaurantCard({ restaurant, onPress }: RestaurantCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(restaurant.id);

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: restaurant.image }} style={styles.image} />

      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => toggleFavorite(restaurant.id)}
      >
        <Ionicons
          name={favorited ? "heart" : "heart-outline"}
          size={22}
          color={favorited ? Colors.light.primary : 'white'}
        />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.star}>⭐</Text>
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
        </View>

        <Text style={styles.category}>{restaurant.category}</Text>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>🕒 {restaurant.deliveryTime}</Text>
          <Text style={styles.footerText}> • </Text>
          <Text style={styles.footerText}>🚚 ₦{restaurant.deliveryFee}</Text>
        </View>
        {restaurant.deliveryFee === 0 && (
          <Text style={{ color: 'green', fontWeight: 'bold', marginTop: 4 }}>
            🎉 Free Delivery
          </Text>
        )}

      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    marginBottom: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3, // For Android shadow
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#eee', // Placeholder color before image loads
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
  heartIcon: {
    fontSize: 16,
  },
  infoContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
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
    fontSize: 12,
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
  },
});
