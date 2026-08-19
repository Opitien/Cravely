import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { CartItem } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';

interface CartItemCardProps {
  item: CartItem;
}

export default function CartItemCard({ item }: CartItemCardProps) {
  const { increaseQuantity, removeFromCart } = useCart();

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.restaurantName}>{item.restaurantName}</Text>
        <Text style={styles.price}>₦{(item.price * item.quantity).toLocaleString()}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="remove" size={18} color={Colors.light.primary} />
        </TouchableOpacity>
        
        <Text style={styles.quantity}>{item.quantity}</Text>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => increaseQuantity(item.id)}
        >
          <Ionicons name="add" size={18} color={Colors.light.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 2,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  details: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: Typography.sizes.small,
    color: '#888',
    marginBottom: 6,
  },
  price: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.primary,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quantity: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    marginHorizontal: 12,
    color: Colors.light.text,
  },
});
