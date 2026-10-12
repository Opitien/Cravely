import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PaymentMethod } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

export const PAYMENT_METHOD_DETAILS: Record<
  PaymentMethod,
  { title: string; icon: 'card-outline' | 'cash-outline'; description: string }
> = {
  paystack: {
    title: 'Pay online',
    icon: 'card-outline',
    description: 'Card, bank transfer or USSD — secured by Paystack',
  },
  cash: {
    title: 'Cash on Delivery',
    icon: 'cash-outline',
    description: 'Pay in cash when your order arrives',
  },
};

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodCard({ method, isSelected, onSelect }: PaymentMethodCardProps) {
  const details = PAYMENT_METHOD_DETAILS[method];

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onSelect(method)}
      activeOpacity={0.7}
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
    >
      <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
        <Ionicons name={details.icon} size={24} color={isSelected ? Colors.light.primary : '#666'} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isSelected && styles.titleSelected]}>{details.title}</Text>
        <Text style={styles.description}>{details.description}</Text>
      </View>

      <View style={styles.radioContainer}>
        <Ionicons
          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
          size={24}
          color={isSelected ? Colors.light.primary : '#CCC'}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primaryTint,
  },
  iconContainer: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 12,
    marginRight: 16,
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  titleSelected: {
    color: Colors.light.primary,
  },
  description: {
    fontSize: Typography.sizes.small,
    color: '#888',
  },
  radioContainer: {
    marginLeft: 12,
  },
});
