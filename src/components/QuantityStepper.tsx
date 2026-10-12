import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface QuantityStepperProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export default function QuantityStepper({ quantity, onIncrease, onDecrease }: QuantityStepperProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onDecrease} accessibilityLabel="Decrease quantity">
        <Ionicons name={quantity === 1 ? 'trash-outline' : 'remove'} size={16} color={Colors.light.primary} />
      </TouchableOpacity>
      <Text style={styles.quantity}>{quantity}</Text>
      <TouchableOpacity style={styles.button} onPress={onIncrease} accessibilityLabel="Increase quantity">
        <Ionicons name="add" size={18} color={Colors.light.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 4,
  },
  button: {
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
    minWidth: 16,
    textAlign: 'center',
  },
});
