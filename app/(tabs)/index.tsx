import React, { useState } from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import HomeHeader from '../../src/components/HomeHeader';
import SearchBar from '../../src/components/SearchBar';
import CategoryList from '../../src/components/CategoryList';
import RestaurantCard from '../../src/components/RestaurantCard';
import FloatingCartButton from '../../src/components/FloatingCartButton';
import { useCategories, useRestaurants } from '../../src/hooks/queries';
import { useDebouncedValue } from '../../src/hooks/useDebouncedValue';
import { getErrorMessage } from '../../src/lib/format';
import { makeStyles, useTheme } from '../../src/theme';
import { EmptyState, ErrorState, RestaurantCardSkeleton, Screen, SectionHeader } from '../../src/ui';

export default function HomeScreen() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const categories = useCategories();
  const restaurants = useRestaurants(debouncedSearch, category);
  const isFiltering = !!debouncedSearch || !!category;

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([restaurants.refetch(), categories.refetch()]);
    setIsRefreshing(false);
  };

  const list = restaurants.data ?? [];
  const freeDelivery = list.filter((r) => r.deliveryFee === 0 && r.isOpen);
  const open = (id: string) => router.push(`/restaurant/${id}`);

  const title = debouncedSearch
    ? `Results for “${debouncedSearch}”`
    : category
      ? (categories.data?.find((c) => c.slug === category)?.name ?? 'Restaurants')
      : 'All restaurants';

  const renderRestaurants = () => {
    if (restaurants.isLoading && !restaurants.data) {
      return [0, 1, 2].map((i) => <RestaurantCardSkeleton key={i} />);
    }
    if (restaurants.error && !restaurants.data) {
      return (
        <ErrorState
          message={getErrorMessage(restaurants.error, 'Could not load restaurants.')}
          onRetry={() => restaurants.refetch()}
          style={styles.inlineState}
        />
      );
    }
    if (list.length === 0) {
      return (
        <EmptyState
          emoji="🔍"
          title="Nothing found"
          subtitle={isFiltering ? 'Try another search or category.' : 'No restaurants are available yet.'}
          actionLabel={isFiltering ? 'Clear filters' : undefined}
          onAction={() => {
            setSearch('');
            setCategory(null);
          }}
          style={styles.inlineState}
        />
      );
    }
    return list.map((r) => <RestaurantCard key={r.id} restaurant={r} onPress={() => open(r.id)} />);
  };

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={t.colors.primary}
            colors={[t.colors.primary]}
          />
        }
      >
        <HomeHeader />
        <SearchBar value={search} onChangeText={setSearch} />
        {categories.data && categories.data.length > 0 && (
          <CategoryList categories={categories.data} selectedSlug={category} onSelect={setCategory} />
        )}

        {!isFiltering && freeDelivery.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title="Free delivery 🛵" />
            <FlatList
              horizontal
              data={freeDelivery}
              keyExtractor={(r) => r.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.carousel}
              renderItem={({ item }) => (
                <RestaurantCard restaurant={item} variant="compact" onPress={() => open(item.id)} />
              )}
            />
          </View>
        )}

        <View style={styles.section}>
          <SectionHeader title={title} />
          {renderRestaurants()}
        </View>
      </ScrollView>
      <FloatingCartButton />
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  content: { paddingBottom: 110 },
  section: { marginTop: t.spacing.sm },
  carousel: { paddingHorizontal: t.spacing.xl, gap: t.spacing.lg, paddingBottom: t.spacing.xxl },
  inlineState: { flex: 0, paddingVertical: t.spacing.xxxl },
}));
