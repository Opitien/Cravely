import React from 'react';
import { Pressable, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Restaurant } from '../types';
import { useFavorites } from '../hooks/queries';
import { formatDeliveryTime, formatNaira } from '../lib/format';
import { makeStyles, useTheme } from '../theme';
import { IconButton, Pill, Text } from '../ui';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  /** compact = narrow card for horizontal carousels */
  variant?: 'full' | 'compact';
}

export default function RestaurantCard({ restaurant, onPress, variant = 'full' }: RestaurantCardProps) {
  const t = useTheme();
  const styles = useStyles();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(restaurant.id);
  const compact = variant === 'compact';

  const onToggleFavorite = () => {
    Haptics.selectionAsync().catch(() => undefined);
    toggleFavorite(restaurant.id);
  };

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${restaurant.name}, ${restaurant.cuisine}, rated ${restaurant.rating.toFixed(1)}`}
      style={({ pressed }) => [compact ? styles.compact : styles.full, pressed && styles.pressed]}
    >
      <View style={[styles.imageWrap, compact && styles.imageWrapCompact]}>
        <Image
          source={{ uri: restaurant.imageUrl }}
          style={[styles.image, !restaurant.isOpen && styles.imageClosed]}
          contentFit="cover"
          transition={250}
          recyclingKey={restaurant.id}
        />
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={styles.gradient} />

        <View style={styles.imageFooter}>
          <View style={styles.timeBadge}>
            <Ionicons name="time" size={13} color={t.colors.text} />
            <Text variant="caption" style={{ fontFamily: t.fonts.bold }}>
              {formatDeliveryTime(restaurant.deliveryMinMinutes, restaurant.deliveryMaxMinutes)}
            </Text>
          </View>
          {!restaurant.isOpen && (
            <Pill label="Closed" color="#FFFFFF" background="rgba(0,0,0,0.6)" />
          )}
        </View>

        <IconButton
          icon={favorited ? 'heart' : 'heart-outline'}
          color={favorited ? t.colors.primary : '#FFFFFF'}
          variant="glass"
          size={36}
          onPress={onToggleFavorite}
          accessibilityLabel={favorited ? 'Remove from favourites' : 'Save to favourites'}
          style={styles.heart}
        />
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text variant={compact ? 'bodyStrong' : 'subheading'} numberOfLines={1} style={{ flex: 1 }}>
            {restaurant.name}
          </Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={13} color={t.colors.star} />
            <Text variant="label">{restaurant.rating.toFixed(1)}</Text>
          </View>
        </View>
        <Text variant="caption" tone="secondary" numberOfLines={1}>
          {restaurant.cuisine}
          {'  ·  '}
          {restaurant.deliveryFee === 0 ? (
            <Text variant="caption" tone="success" style={{ fontFamily: t.fonts.bold }}>
              Free delivery
            </Text>
          ) : (
            `${formatNaira(restaurant.deliveryFee)} delivery`
          )}
        </Text>
      </View>
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  full: { marginHorizontal: t.spacing.xl, marginBottom: t.spacing.xxl },
  compact: { width: 240 },
  pressed: { opacity: 0.9, transform: [{ scale: 0.985 }] },
  imageWrap: {
    height: 190,
    borderRadius: t.radius.xl,
    overflow: 'hidden',
    backgroundColor: t.colors.skeleton,
  },
  imageWrapCompact: { height: 140, borderRadius: t.radius.lg },
  image: { width: '100%', height: '100%' },
  imageClosed: { opacity: 0.45 },
  gradient: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '45%' },
  imageFooter: {
    position: 'absolute',
    left: t.spacing.md,
    right: t.spacing.md,
    bottom: t.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: t.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: t.radius.pill,
  },
  heart: { position: 'absolute', top: t.spacing.md, right: t.spacing.md },
  info: { paddingTop: t.spacing.md, paddingHorizontal: 2, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
}));
