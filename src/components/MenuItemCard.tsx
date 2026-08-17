import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { MenuItem, Restaurant } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

interface MenuItemCardProps {
  item: MenuItem;
  restaurant: Restaurant;
  onPress?: () => void;
}

// Displays a single menu item as a horizontal row
export default function MenuItemCard({ item, restaurant, onPress }: MenuItemCardProps) {
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(item, restaurant);
  };

  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* Text info on the left */}
      <View style={styles.textContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.price}>₦{item.price.toLocaleString()}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Food image on the right */}
      <Image source={{ uri: item.image }} style={styles.image} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 1,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
  },
  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
});
