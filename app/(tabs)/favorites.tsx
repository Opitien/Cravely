import React from 'react';
import { Alert, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites, useRestaurantsByIds } from '../../src/hooks/queries';
import RestaurantCard from '../../src/components/RestaurantCard';
import { getErrorMessage } from '../../src/lib/format';
import { makeStyles } from '../../src/theme';
import { EmptyState, ErrorState, LargeTitle, RestaurantCardSkeleton, Screen, Text } from '../../src/ui';

export default function FavoritesScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { favoriteIds, isLoading: favoritesLoading, clearFavorites } = useFavorites();
  const restaurants = useRestaurantsByIds(favoriteIds);

  // Keep the list in sync with optimistic un-favouriting before the refetch lands.
  const saved = (restaurants.data ?? []).filter((r) => favoriteIds.includes(r.id));

  const confirmClear = () =>
    Alert.alert('Remove all saved restaurants?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove all', style: 'destructive', onPress: clearFavorites },
    ]);

  const renderBody = () => {
    if (favoritesLoading || (restaurants.isLoading && favoriteIds.length > 0)) {
      return [0, 1].map((i) => <RestaurantCardSkeleton key={i} />);
    }
    if (restaurants.error && !restaurants.data) {
      return (
        <ErrorState
          message={getErrorMessage(restaurants.error, 'Could not load your saved restaurants.')}
          onRetry={restaurants.refetch}
        />
      );
    }
    if (favoriteIds.length === 0) {
      return (
        <EmptyState
          emoji="💛"
          title="Nothing saved yet"
          subtitle="Tap the heart on any restaurant to keep it here for later."
          actionLabel="Explore restaurants"
          onAction={() => router.navigate('/')}
        />
      );
    }
    return (
      <FlatList
        data={saved}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <RestaurantCard restaurant={item} onPress={() => router.push(`/restaurant/${item.id}`)} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <Screen>
      <LargeTitle
        title="Saved"
        subtitle={favoriteIds.length ? `${favoriteIds.length} restaurant${favoriteIds.length !== 1 ? 's' : ''}` : undefined}
        right={
          favoriteIds.length > 0 ? (
            <Pressable onPress={confirmClear} hitSlop={8} accessibilityRole="button">
              <Text variant="label" tone="primary">
                Clear
              </Text>
            </Pressable>
          ) : null
        }
      />
      {renderBody()}
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  list: { paddingTop: t.spacing.xs, paddingBottom: t.spacing.xxxl },
}));
