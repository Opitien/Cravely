import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '../types';
import { getRestaurants } from '../services/api';
import Typography from '../constants/Typography';
import Colors from '../constants/Colors';

export default function RestaurantList() {
  const router = useRouter();

  // --- NEW: State for our fetched data ---
  // restaurants: starts as an empty array, gets filled when the API responds
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  // isLoading: true while waiting for the API, false when done
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: useEffect to fetch data when the component first mounts ---
  // The empty [] means: "run this only once, when the screen first appears"
  useEffect(() => {
    // We define an async function inside useEffect
    async function fetchData() {
      // await pauses here until getRestaurants() finishes (after ~1.5s)
      const data = await getRestaurants();
      setRestaurants(data);   // Save the data into state
      setIsLoading(false);    // Tell the UI we're done loading
    }

    fetchData(); // Call our async function
  }, []); // Empty array = run only once on mount

  const handlePress = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular near you</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      {/* Show a spinner while loading, show the list when done */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.loadingText}>Finding restaurants near you...</Text>
        </View>
      ) : (
        restaurants.map((restaurant) => (
          <RestaurantCard
            key={restaurant.id}
            restaurant={restaurant}
            onPress={() => handlePress(restaurant.id)}
          />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    fontSize: Typography.sizes.medium,
    color: '#888',
    marginTop: 12,
  },
});
