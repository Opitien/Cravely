import React from 'react';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../src/context/CartContext';
import CartItemCard from '../../src/components/CartItemCard';
import { formatNaira } from '../../src/lib/format';
import { makeStyles, useTheme } from '../../src/theme';
import { BottomBar, Button, Card, Divider, EmptyState, LargeTitle, Screen, SummaryRow, Text } from '../../src/ui';

export default function CartScreen() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const { items, restaurant, subtotal, totalItems, clearCart } = useCart();

  if (items.length === 0 || !restaurant) {
    return (
      <Screen>
        <LargeTitle title="Your cart" />
        <EmptyState
          emoji="🛒"
          title="Your cart is empty"
          subtitle="Find something delicious and it will show up here."
          actionLabel="Browse restaurants"
          onAction={() => router.navigate('/')}
        />
      </Screen>
    );
  }

  // Display estimate only; the server recalculates every amount when the order is placed.
  const deliveryFee = restaurant.deliveryFee;
  const total = subtotal + deliveryFee;
  const shortBy = restaurant.minOrder - subtotal;

  const confirmClear = () =>
    Alert.alert('Clear cart?', 'This removes every item from your cart.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);

  return (
    <Screen>
      <LargeTitle
        title="Your cart"
        subtitle={`${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        right={
          <Pressable onPress={confirmClear} hitSlop={8} accessibilityRole="button">
            <Text variant="label" tone="primary">
              Clear
            </Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Card onPress={() => router.push(`/restaurant/${restaurant.id}`)} style={styles.restaurant}>
          <Image source={{ uri: restaurant.imageUrl }} style={styles.restaurantImage} transition={200} />
          <View style={{ flex: 1 }}>
            <Text variant="caption" tone="muted">
              Ordering from
            </Text>
            <Text variant="subheading" numberOfLines={1}>
              {restaurant.name}
            </Text>
          </View>
          <View style={styles.addMore}>
            <Ionicons name="add" size={16} color={t.colors.primary} />
            <Text variant="label" tone="primary">
              Add items
            </Text>
          </View>
        </Card>

        <Card style={styles.items}>
          {items.map((item, i) => (
            <CartItemCard key={item.menuItemId} item={item} last={i === items.length - 1} />
          ))}
        </Card>

        <Card>
          <SummaryRow label="Subtotal" value={formatNaira(subtotal)} />
          <SummaryRow label="Delivery fee" value={deliveryFee === 0 ? 'Free' : formatNaira(deliveryFee)} />
          <Divider style={{ marginVertical: t.spacing.md }} />
          <SummaryRow label="Total" value={formatNaira(total)} strong />
        </Card>

        {shortBy > 0 && (
          <View style={styles.notice}>
            <Ionicons name="information-circle" size={18} color={t.colors.warning} />
            <Text variant="caption" style={{ color: t.colors.warning, flex: 1 }}>
              Add {formatNaira(shortBy)} more to reach the {formatNaira(restaurant.minOrder)} minimum order.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomBar>
        <Button
          title="Go to checkout"
          trailing={formatNaira(total)}
          onPress={() => router.push('/checkout')}
          disabled={shortBy > 0}
        />
      </BottomBar>
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  content: { paddingHorizontal: t.spacing.xl, paddingBottom: t.spacing.xxl, gap: t.spacing.lg },
  restaurant: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.md },
  restaurantImage: { width: 48, height: 48, borderRadius: t.radius.md, backgroundColor: t.colors.skeleton },
  addMore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.primarySoft,
  },
  items: { paddingVertical: t.spacing.xs },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    padding: t.spacing.md,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.warningSoft,
  },
}));
