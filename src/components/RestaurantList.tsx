import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import RestaurantCard from './RestaurantCard';
import { Restaurant } from '../types';
import { getRestaurants } from '../services/api';
import Typography from '../constants/Typography';
import Colors from '../constants/Colors';

export default function RestaurantList() {
  const router = useRouter();

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch restaurants
  const fetchData = async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (e) {
      setError('Could not load restaurants. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch when component first mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handlePress = (restaurantId: string) => {
    router.push(`/restaurant/${restaurantId}`);
  };

  // Retry button
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular near you</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color={Colors.light.primary}
          />

          <Text style={styles.loadingText}>
            Finding restaurants near you...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {error}
          </Text>

          <TouchableOpacity
            onPress={handleRetry}
            style={styles.errorButton}
          >
            <Ionicons
              name="refresh"
              size={18}
              color="white"
            />

            <Text style={styles.errorButtonText}>
              Try Again
            </Text>
          </TouchableOpacity>
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

  errorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    marginTop: 16,
  },

  errorButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
});