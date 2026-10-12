import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Address } from '../types';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

interface AddressCardProps {
  address: Address;
  isSelected?: boolean;
  onPress?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

export default function AddressCard({ address, isSelected, onPress, actionLabel, onAction }: AddressCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, isSelected && styles.cardSelected]}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
      accessibilityRole={onPress ? 'radio' : undefined}
      accessibilityState={onPress ? { selected: !!isSelected } : undefined}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="location" size={24} color={Colors.light.primary} />
      </View>
      <View style={styles.textContainer}>
        <View style={styles.labelRow}>
          <Text style={styles.title}>{address.label}</Text>
          {address.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
        </View>
        <Text style={styles.addressText}>{address.line1}</Text>
        <Text style={styles.nameText}>
          {address.city}, {address.state} · {address.phone}
        </Text>
      </View>
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.changeButton} onPress={onAction}>
          <Text style={styles.changeText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : isSelected !== undefined ? (
        <Ionicons
          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={isSelected ? Colors.light.primary : '#CCC'}
          style={styles.radio}
        />
      ) : null}
    </TouchableOpacity>
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
    marginBottom: 12,
  },
  cardSelected: {
    borderColor: Colors.light.primary,
    backgroundColor: Colors.light.primaryTint,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 99, 71, 0.1)',
    padding: 10,
    borderRadius: 12,
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: Typography.sizes.small,
    color: '#888',
  },
  defaultBadge: {
    marginLeft: 8,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.light.success,
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
    paddingLeft: 8,
  },
  changeText: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.small,
  },
  radio: {
    alignSelf: 'center',
    marginLeft: 8,
  },
});
