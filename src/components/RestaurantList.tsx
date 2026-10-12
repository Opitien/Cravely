import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import RestaurantCard from './RestaurantCard';
import { EmptyState, ErrorState, LoadingState } from './ScreenState';
import { Restaurant } from '../types';
import Typography from '../constants/Typography';
import Colors from '../constants/Colors';

interface RestaurantListProps {
  title: string;
  restaurants: Restaurant[] | undefined;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function RestaurantList({ title, restaurants, isLoading, error, onRetry }: RestaurantListProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {restaurants && restaurants.length > 0 && (
          <Text style={styles.count}>{restaurants.length} places</Text>
        )}
      </View>

      {isLoading && !restaurants ? (
        <LoadingState message="Finding restaurants near you..." />
      ) : error && !restaurants ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : !restaurants || restaurants.length === 0 ? (
        <EmptyState emoji="🔍" title="No restaurants found" subtitle="Try a different search or category." />
      ) : (
        // Rendered with map (not FlatList) because this list sits inside the Home ScrollView.
        restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => router.push(`/restaurant/${restaurant.id}`)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 96, // room for the floating cart button
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  count: {
    fontSize: 14,
    color: Colors.light.textMuted,
    fontWeight: '600',
  },
});
