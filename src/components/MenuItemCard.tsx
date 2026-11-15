import React from 'react';
import { Alert, View } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { AnimatePresence, MotiView } from 'moti';
import { MenuItem, RestaurantWithMenu } from '../types';
import { useCart } from '../context/CartContext';
import { formatNaira } from '../lib/format';
import { makeStyles, useTheme } from '../theme';
import { Icon, Pill, Pressable, Text, enter, useReduceMotion } from '../ui';
import QuantityStepper from './QuantityStepper';

interface MenuItemCardProps {
  item: MenuItem;
  restaurant: RestaurantWithMenu;
  index?: number;
}

/** Menu row (inset grouped style) with a springy "+" that turns into a stepper once added. */
export default function MenuItemCard({ item, restaurant, index = 0 }: MenuItemCardProps) {
  const t = useTheme();
  const styles = useStyles();
  const reduce = useReduceMotion();
  const { addToCart, replaceCart, increaseQuantity, decreaseQuantity, quantityOf, restaurant: cartRestaurant } = useCart();
  const quantity = quantityOf(item.id);
  const canOrder = restaurant.isOpen && item.isAvailable;

  const handleAdd = () => {
    const result = addToCart(item, restaurant);
    if (result === 'added') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
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
    <MotiView {...enter(index, reduce)} style={[styles.row, !canOrder && styles.disabled]}>
      <View style={styles.text}>
        <Text variant="headline" numberOfLines={2}>
          {item.name}
        </Text>
        {item.description ? (
          <Text variant="footnote" tone="secondary" numberOfLines={2} style={styles.description}>
            {item.description}
          </Text>
        ) : null}
        <View style={styles.priceRow}>
          <Text variant="subheadlineStrong">{formatNaira(item.price)}</Text>
          {!item.isAvailable && <Pill label="Sold out" color={t.colors.danger} background={t.colors.dangerSoft} />}
        </View>
        <AnimatePresence>
          {quantity > 0 && canOrder && (
            <MotiView
              key="stepper"
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', damping: 14, stiffness: 240 }}
              style={styles.stepper}
            >
              <QuantityStepper
                size="sm"
                quantity={quantity}
                onIncrease={() => increaseQuantity(item.id)}
                onDecrease={() => decreaseQuantity(item.id)}
              />
            </MotiView>
          )}
        </AnimatePresence>
      </View>

      <View style={styles.imageWrap}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={{ fontSize: 32 }}>🍽️</Text>
          </View>
        )}
        <AnimatePresence>
          {canOrder && quantity === 0 && (
            <MotiView
              key="add"
              from={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', damping: 12, stiffness: 260 }}
              style={styles.addButtonWrap}
            >
              <Pressable
                onPress={handleAdd}
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.name} to cart`}
                hitSlop={6}
                pressScale={0.85}
                style={styles.addButton}
              >
                <Icon name="add" size={20} color={t.colors.textOnPrimary} weight="bold" />
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </MotiView>
  );
}

const useStyles = makeStyles((t) => ({
  row: {
    flexDirection: 'row',
    gap: t.spacing.lg,
    paddingVertical: t.spacing.lg,
    marginHorizontal: t.spacing.lg,
    borderBottomWidth: t.hairline,
    borderBottomColor: t.colors.separator,
  },
  disabled: { opacity: 0.5 },
  text: { flex: 1, justifyContent: 'center' },
  description: { marginTop: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm, marginTop: t.spacing.sm },
  stepper: { marginTop: t.spacing.md, alignSelf: 'flex-start' },
  imageWrap: { width: 108, height: 108 },
  image: { width: 108, height: 108, borderRadius: t.radius.md, backgroundColor: t.colors.skeleton },
  imagePlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: t.colors.tertiaryFill },
  addButtonWrap: { position: 'absolute', right: -6, bottom: -6 },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: t.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: t.colors.groupedBackground,
  },
}));
