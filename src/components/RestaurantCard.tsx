import React, { useEffect } from 'react';
import { View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { Restaurant } from '../types';
import { useFavorites } from '../hooks/queries';
import { formatDeliveryTime, formatNaira } from '../lib/format';
import { makeStyles, useTheme } from '../theme';
import { Icon, IconButton, Pill, Pressable, Text, enter, useReduceMotion } from '../ui';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  /** compact = narrow card for horizontal carousels */
  variant?: 'full' | 'compact';
  /** Position in its list, for the staggered entrance. */
  index?: number;
  /** Optional "1.2 km" string shown next to the delivery fee. */
  distanceLabel?: string;
}

/** Heart that pops when favourited: SF Symbol bounce on iOS, spring scale + tilt on Android/web. */
export function AnimatedHeart({ favorited, onPress, glass }: { favorited: boolean; onPress: () => void; glass?: boolean }) {
  const t = useTheme();
  const reduce = useReduceMotion();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const first = React.useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce) return;
    scale.value = withSequence(withTiming(0.7, { duration: 60 }), withSpring(favorited ? 1.25 : 1, { damping: 8, stiffness: 300 }), withSpring(1, { damping: 12 }));
    rotate.value = withSequence(withTiming(favorited ? -12 : 0, { duration: 70 }), withSpring(0, { damping: 9 }));
  }, [favorited, reduce, rotate, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }] }));

  return (
    <Animated.View style={style}>
      <IconButton
        icon={favorited ? 'heart' : 'heart-outline'}
        color={favorited ? t.colors.primary : glass ? '#FFFFFF' : t.colors.label}
        variant={glass ? 'glass' : 'solid'}
        size={36}
        onPress={onPress}
        animation="bounce"
        animationKey={favorited}
        accessibilityLabel={favorited ? 'Remove from favourites' : 'Save to favourites'}
      />
    </Animated.View>
  );
}

export default function RestaurantCard({ restaurant, onPress, variant = 'full', index = 0, distanceLabel }: RestaurantCardProps) {
  const t = useTheme();
  const styles = useStyles();
  const reduce = useReduceMotion();
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(restaurant.id);
  const compact = variant === 'compact';

  const onToggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    toggleFavorite(restaurant.id);
  };

  return (
    <MotiView {...enter(index, reduce)} style={compact ? styles.compact : styles.full}>
      <Pressable
        onPress={onPress}
        pressScale={0.98}
        accessibilityRole="button"
        accessibilityLabel={`${restaurant.name}, ${restaurant.cuisine}, rated ${restaurant.rating.toFixed(1)}`}
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
              <Icon name="time" size={12} color={t.colors.label} weight="semibold" />
              <Text variant="caption1Strong">{formatDeliveryTime(restaurant.deliveryMinMinutes, restaurant.deliveryMaxMinutes)}</Text>
            </View>
            {!restaurant.isOpen && <Pill label="Closed" color="#FFFFFF" background="rgba(0,0,0,0.55)" />}
          </View>

          <View style={styles.heart}>
            <AnimatedHeart favorited={favorited} onPress={onToggleFavorite} glass />
          </View>
        </View>

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text variant={compact ? 'subheadlineStrong' : 'headline'} numberOfLines={1} style={{ flex: 1 }}>
              {restaurant.name}
            </Text>
            <View style={styles.rating}>
              <Icon name="star" size={12} color={t.colors.star} />
              <Text variant="footnoteStrong">{restaurant.rating.toFixed(1)}</Text>
            </View>
          </View>
          <Text variant="footnote" tone="secondary" numberOfLines={1}>
            {restaurant.cuisine}
            {'  ·  '}
            {restaurant.deliveryFee === 0 ? (
              <Text variant="footnoteStrong" tone="success">
                Free delivery
              </Text>
            ) : (
              `${formatNaira(restaurant.deliveryFee)} delivery`
            )}
            {distanceLabel ? `  ·  ${distanceLabel}` : ''}
          </Text>
        </View>
      </Pressable>
    </MotiView>
  );
}

const useStyles = makeStyles((t) => ({
  full: { marginHorizontal: t.spacing.lg, marginBottom: t.spacing.xxl },
  compact: { width: 240 },
  imageWrap: {
    height: 190,
    borderRadius: t.radius.lg,
    overflow: 'hidden',
    backgroundColor: t.colors.skeleton,
  },
  imageWrapCompact: { height: 140, borderRadius: t.radius.md },
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
    backgroundColor: t.colors.secondaryGroupedBackground,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: t.radius.pill,
  },
  heart: { position: 'absolute', top: t.spacing.md, right: t.spacing.md },
  info: { paddingTop: t.spacing.md, paddingHorizontal: 2, gap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 3 },
}));
