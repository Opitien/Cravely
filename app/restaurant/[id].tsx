import React, { useRef, useState } from 'react';
import { Animated, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useFavorites, useRestaurant } from '../../src/hooks/queries';
import MenuItemCard from '../../src/components/MenuItemCard';
import FloatingCartButton from '../../src/components/FloatingCartButton';
import { formatDeliveryTime, formatNaira, getErrorMessage } from '../../src/lib/format';
import { RestaurantWithMenu } from '../../src/types';
import { makeStyles, useTheme } from '../../src/theme';
import { EmptyState, ErrorState, IconButton, Skeleton, Text } from '../../src/ui';

const HERO_HEIGHT = 280;

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  // Light status-bar icons over the photo, theme default once the solid header shows.
  const [pastHero, setPastHero] = useState(false);
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
    listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const past = e.nativeEvent.contentOffset.y > HERO_HEIGHT - 110;
      setPastHero((prev) => (prev === past ? prev : past));
    },
  });
  const { data: restaurant, isLoading, error, refetch, isRefetching } = useRestaurant(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  const goBack = () => (router.canGoBack() ? router.back() : router.navigate('/'));

  if (isLoading) return <RestaurantSkeleton />;
  if (error && !restaurant) {
    return <ErrorState message={getErrorMessage(error, 'Could not load this restaurant.')} onRetry={refetch} />;
  }
  if (!restaurant) {
    return <EmptyState emoji="😕" title="Restaurant not found" actionLabel="Go back" onAction={goBack} />;
  }

  const favorited = isFavorite(restaurant.id);
  const headerOpacity = scrollY.interpolate({
    inputRange: [HERO_HEIGHT - 140, HERO_HEIGHT - 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const heroScale = scrollY.interpolate({ inputRange: [-200, 0], outputRange: [1.6, 1], extrapolateRight: 'clamp' });

  const onFavorite = () => {
    Haptics.selectionAsync().catch(() => undefined);
    toggleFavorite(restaurant.id);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style={pastHero && !t.dark ? 'dark' : 'light'} />
      <Animated.FlatList
        data={restaurant.menu}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuItemCard item={item} restaurant={restaurant} />}
        ListHeaderComponent={
          <>
            <Animated.View style={[styles.hero, { transform: [{ scale: heroScale }] }]}>
              <Image source={{ uri: restaurant.imageUrl }} style={styles.heroImage} contentFit="cover" transition={250} />
              <LinearGradient colors={['rgba(0,0,0,0.45)', 'transparent', 'transparent']} style={styles.heroImage} />
            </Animated.View>
            <RestaurantInfo restaurant={restaurant} />
          </>
        }
        ListEmptyComponent={<EmptyState emoji="📋" title="No menu items yet" style={{ flex: 0 }} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#FFFFFF" colors={[t.colors.primary]} />
        }
      />

      {/* Solid header that fades in once the hero scrolls away */}
      <Animated.View
        pointerEvents="none"
        style={[styles.solidHeader, { paddingTop: insets.top, height: insets.top + 56, opacity: headerOpacity }]}
      >
        <Text variant="subheading" numberOfLines={1} style={styles.solidHeaderTitle}>
          {restaurant.name}
        </Text>
      </Animated.View>

      <View style={[styles.headerButtons, { top: insets.top + 8 }]}>
        <IconButton icon="arrow-back" onPress={goBack} accessibilityLabel="Go back" />
        <IconButton
          icon={favorited ? 'heart' : 'heart-outline'}
          color={favorited ? t.colors.primary : undefined}
          onPress={onFavorite}
          accessibilityLabel={favorited ? 'Remove from saved' : 'Save restaurant'}
        />
      </View>

      <FloatingCartButton />
    </View>
  );
}

function RestaurantInfo({ restaurant }: { restaurant: RestaurantWithMenu }) {
  const t = useTheme();
  const styles = useStyles();
  const stats: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; sub: string; color?: string }[] = [
    { icon: 'star', label: restaurant.rating.toFixed(1), sub: 'Rating', color: t.colors.star },
    {
      icon: 'time',
      label: formatDeliveryTime(restaurant.deliveryMinMinutes, restaurant.deliveryMaxMinutes),
      sub: 'Delivery',
    },
    {
      icon: 'bicycle',
      label: restaurant.deliveryFee === 0 ? 'Free' : formatNaira(restaurant.deliveryFee),
      sub: 'Delivery fee',
      color: restaurant.deliveryFee === 0 ? t.colors.success : undefined,
    },
  ];

  return (
    <View style={styles.sheet}>
      <Text variant="title">{restaurant.name}</Text>
      <Text tone="secondary" style={{ marginTop: 4 }}>
        {restaurant.cuisine}
      </Text>

      {!restaurant.isOpen && (
        <View style={styles.closed}>
          <Ionicons name="moon" size={16} color={t.colors.danger} />
          <Text variant="label" style={{ color: t.colors.danger, flex: 1 }}>
            Closed right now. You can browse the menu but can't order yet.
          </Text>
        </View>
      )}

      <View style={styles.stats}>
        {stats.map((s, i) => (
          <React.Fragment key={s.sub}>
            {i > 0 && <View style={styles.statDivider} />}
            <View style={styles.stat}>
              <View style={styles.statValue}>
                <Ionicons name={s.icon} size={15} color={s.color ?? t.colors.text} />
                <Text variant="bodyStrong" style={s.color ? { color: s.color } : undefined}>
                  {s.label}
                </Text>
              </View>
              <Text variant="caption" tone="muted">
                {s.sub}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {restaurant.minOrder > 0 && (
        <Text variant="caption" tone="muted" style={{ marginTop: t.spacing.md }}>
          Minimum order {formatNaira(restaurant.minOrder)}
        </Text>
      )}

      <Text variant="heading" style={{ marginTop: t.spacing.xxl }}>
        Menu
      </Text>
    </View>
  );
}

function RestaurantSkeleton() {
  const styles = useStyles();
  return (
    <View style={styles.screen}>
      <Skeleton height={HERO_HEIGHT} radius={0} />
      <View style={[styles.sheet, { gap: 12 }]}>
        <Skeleton width="65%" height={26} />
        <Skeleton width="40%" height={16} />
        <Skeleton height={64} radius={16} style={{ marginTop: 12 }} />
        {[0, 1, 2].map((i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 16, marginTop: 16 }}>
            <View style={{ flex: 1, gap: 8 }}>
              <Skeleton width="70%" height={16} />
              <Skeleton width="90%" height={12} />
              <Skeleton width="30%" height={14} />
            </View>
            <Skeleton width={112} height={112} radius={16} />
          </View>
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  listContent: { paddingBottom: 130 },
  hero: { height: HERO_HEIGHT, backgroundColor: t.colors.skeleton },
  heroImage: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  sheet: {
    marginTop: -28,
    backgroundColor: t.colors.background,
    borderTopLeftRadius: t.radius.xxl,
    borderTopRightRadius: t.radius.xxl,
    paddingHorizontal: t.spacing.xl,
    paddingTop: t.spacing.xxl,
  },
  closed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    marginTop: t.spacing.lg,
    padding: t.spacing.md,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.dangerSoft,
  },
  stats: {
    flexDirection: 'row',
    marginTop: t.spacing.xl,
    paddingVertical: t.spacing.md,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    ...t.shadow(1),
  },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statValue: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statDivider: { width: 1, backgroundColor: t.colors.border, marginVertical: 4 },
  solidHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: t.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: t.colors.border,
    justifyContent: 'center',
  },
  solidHeaderTitle: { textAlign: 'center', paddingHorizontal: 72 },
  headerButtons: {
    position: 'absolute',
    left: t.spacing.lg,
    right: t.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));
