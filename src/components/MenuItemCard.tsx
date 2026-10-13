import React from 'react';
import { Alert, Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { MenuItem, RestaurantWithMenu } from '../types';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../lib/format';
import { makeStyles, useTheme } from '../theme';
import { Pill, Text } from '../ui';
import QuantityStepper from './QuantityStepper';

interface MenuItemCardProps {
  item: MenuItem;
  restaurant: RestaurantWithMenu;
}

export default function MenuItemCard({ item, restaurant }: MenuItemCardProps) {
  const t = useTheme();
  const styles = useStyles();
  const { addToCart, replaceCart, increaseQuantity, decreaseQuantity, quantityOf, restaurant: cartRestaurant } =
    useCart();
  const quantity = quantityOf(item.id);
  const canOrder = restaurant.isOpen && item.isAvailable;

  const handleAdd = () => {
    const result = addToCart(item, restaurant);
    if (result === 'added') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      return;
    }
    Alert.alert(
      'Start a new cart?',
      `Your cart has items from ${cartRestaurant?.name}. Clear it and add this from ${restaurant.name} instead?`,
      [
        { text: 'Keep current cart', style: 'cancel' },
        { text: 'Start new cart', style: 'destructive', onPress: () => replaceCart(item, restaurant) },
      ]
    );
  };

  return (
    <View style={[styles.row, !canOrder && styles.disabled]}>
      <View style={styles.text}>
        <Text variant="subheading" numberOfLines={2}>
          {item.name}
        </Text>
        {item.description ? (
          <Text variant="caption" tone="secondary" numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.priceRow}>
          <Text variant="bodyStrong">{formatNaira(item.price)}</Text>
          {!item.isAvailable && <Pill label="Sold out" color={t.colors.danger} background={t.colors.dangerSoft} />}
        </View>
        {quantity > 0 && canOrder && (
          <View style={styles.stepper}>
            <QuantityStepper
              size="sm"
              quantity={quantity}
              onIncrease={() => increaseQuantity(item.id)}
              onDecrease={() => decreaseQuantity(item.id)}
            />
          </View>
        )}
      </View>

      <View style={styles.imageWrap}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={{ fontSize: 32 }}>🍽️</Text>
          </View>
        )}
        {canOrder && quantity === 0 && (
          <Pressable
            onPress={handleAdd}
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to cart`}
            hitSlop={6}
            style={({ pressed }) => [styles.addButton, pressed && { transform: [{ scale: 0.9 }] }]}
          >
            <Ionicons name="add" size={22} color={t.colors.textOnPrimary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    gap: t.spacing.lg,
    paddingVertical: t.spacing.lg,
    marginHorizontal: t.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
  },
  disabled: { opacity: 0.55 },
  text: { flex: 1, justifyContent: 'center' },
  description: { marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm, marginTop: t.spacing.sm },
  stepper: { marginTop: t.spacing.md, alignSelf: 'flex-start' },
  imageWrap: { width: 112, height: 112 },
  image: { width: 112, height: 112, borderRadius: t.radius.lg, backgroundColor: t.colors.skeleton },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.surfaceMuted },
  addButton: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: t.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: t.colors.background,
  },
}));
