import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

export type PaymentMethod = 'card' | 'cash' | 'transfer';

interface PaymentMethodCardProps {
  method: PaymentMethod;
  isSelected: boolean;
  onSelect: (method: PaymentMethod) => void;
}

export default function PaymentMethodCard({ method, isSelected, onSelect }: PaymentMethodCardProps) {

  const getMethodDetails = () => {
    if (method === 'card') {
      return {
        title: 'Credit/Debit Card',
        icon: 'card-outline' as const,
        description: 'Pay securely with your bank card',
      };
    }
    if (method === 'transfer') {
      return {
        title: 'Transfer',
        icon: 'business-outline' as const,
        description: 'Pay with mobile banking or USSD',
      };
    }
    return {
      title: 'Cash on Delivery',
      icon: 'cash-outline' as const,
      description: 'Pay in cash when your order arrives',
    };
  };

  const details = getMethodDetails();

  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={() => onSelect(method)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, isSelected && styles.iconContainerSelected]}>
        <Ionicons
          name={details.icon}
          size={24}
          color={isSelected ? Colors.light.primary : '#666'}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, isSelected && styles.titleSelected]}>
          {details.title}
        </Text>
        <Text style={styles.description}>{details.description}</Text>
      </View>

      {/* Radio Button Indicator */}
      <View style={styles.radioContainer}>
        {isSelected ? (
          <Ionicons name="radio-button-on" size={24} color={Colors.light.primary} />
        ) : (
          <Ionicons name="radio-button-off" size={24} color="#CCC" />
        )}
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
    backgroundColor: '#FFF5F3', // Very light tint of tomato
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
