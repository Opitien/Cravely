import React from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useRestaurant } from '../../src/hooks/queries';
import RestaurantHeader from '../../src/components/RestaurantHeader';
import MenuItemCard from '../../src/components/MenuItemCard';
import FloatingCartButton from '../../src/components/FloatingCartButton';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/ScreenState';
import Colors from '../../src/constants/Colors';
import { getErrorMessage } from '../../src/lib/format';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: restaurant, isLoading, error, refetch, isRefetching } = useRestaurant(id);

  if (isLoading) {
    return <LoadingState message="Loading menu..." style={styles.screen} />;
  }

  if (error && !restaurant) {
    return (
      <ErrorState
        message={getErrorMessage(error, 'Could not load this restaurant.')}
        onRetry={refetch}
        style={styles.screen}
      />
    );
  }

  if (!restaurant) {
    return (
      <EmptyState
        emoji="😕"
        title="Restaurant not found"
        actionLabel="Go Back"
        onAction={() => (router.canGoBack() ? router.back() : router.navigate('/'))}
        style={styles.screen}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: restaurant.name }} />
      <FlatList
        data={restaurant.menu}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={<RestaurantHeader restaurant={restaurant} />}
        renderItem={({ item }) => <MenuItemCard item={item} restaurant={restaurant} />}
        ListEmptyComponent={<EmptyState emoji="📋" title="No menu items yet" />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
      />
      <FloatingCartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  listContent: {
    paddingBottom: 110, // room for the floating cart button
  },
});
