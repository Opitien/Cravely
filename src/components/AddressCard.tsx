import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface AddressCardProps {
  address: string;
  name: string;
}

export default function AddressCard({ address, name }: AddressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <Ionicons name="location" size={24} color={Colors.light.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Delivery Address</Text>
        <Text style={styles.addressText}>{address}</Text>
        <Text style={styles.nameText}>{name}</Text>
      </View>
      <TouchableOpacity style={styles.changeButton}>
        <Text style={styles.changeText}>Change</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9F9F9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 99, 71, 0.1)', // Light tint of primary color
    padding: 10,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.small,
    color: '#888',
    marginBottom: 4,
  },
  addressText: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  nameText: {
    fontSize: Typography.sizes.small,
    color: '#666',
  },
  changeButton: {
    justifyContent: 'center',
    paddingVertical: 8,
  },
  changeText: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.small,
  },
});
