import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import HomeHeader from '../../src/components/HomeHeader';
import SearchBar from '../../src/components/SearchBar';
import CategoryList from '../../src/components/CategoryList';
import RestaurantList from '../../src/components/RestaurantList';
import FloatingCartButton from '../../src/components/FloatingCartButton';
import Colors from '../../src/constants/Colors';
import { useCategories, useRestaurants } from '../../src/hooks/queries';
import { useDebouncedValue } from '../../src/hooks/useDebouncedValue';
import { getErrorMessage } from '../../src/lib/format';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const categories = useCategories();
  const restaurants = useRestaurants(debouncedSearch, category);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setIsScrolled(event.nativeEvent.contentOffset.y > 0);
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([restaurants.refetch(), categories.refetch()]);
    setIsRefreshing(false);
  };

  const title = debouncedSearch
    ? `Results for "${debouncedSearch}"`
    : category
      ? (categories.data?.find((c) => c.slug === category)?.name ?? 'Restaurants')
      : 'Popular near you';

  return (
    <View style={styles.screen}>
      <HomeHeader isScrolled={isScrolled} />
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
      >
        <SearchBar value={search} onChangeText={setSearch} />
        {categories.data && categories.data.length > 0 && (
          <CategoryList categories={categories.data} selectedSlug={category} onSelect={setCategory} />
        )}
        <RestaurantList
          title={title}
          restaurants={restaurants.data}
          isLoading={restaurants.isLoading}
          error={restaurants.error ? getErrorMessage(restaurants.error, 'Could not load restaurants.') : null}
          onRetry={() => restaurants.refetch()}
        />
      </ScrollView>
      <FloatingCartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
