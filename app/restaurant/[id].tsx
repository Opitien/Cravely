import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRestaurantById } from '../../src/services/api';
import { Restaurant } from '../../src/types';
import RestaurantHeader from '../../src/components/RestaurantHeader';
import MenuItemCard from '../../src/components/MenuItemCard';
import FloatingCartButton from '../../src/components/FloatingCartButton';
import Colors from '../../src/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // --- State for this screen ---
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch the single restaurant by ID when the screen mounts ---
  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const data = await getRestaurantById(id);
        setRestaurant(data);
      } catch (e) {
        setError('Could not load this restaurant. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRestaurant();
  }, [id]);

  // --- Loading state ---
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator
          size="large"
          color={Colors.light.primary}
        />
        <Text style={styles.loadingText}>
          Loading menu...
        </Text>
      </View>
    );
  }

  // --- Network error state ---
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundEmoji}>⚠️</Text>

        <Text style={styles.notFoundText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={16}
            color="white"
          />
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Not found state (like a 404 error) ---
  if (!restaurant) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFoundEmoji}>😕</Text>

        <Text style={styles.notFoundText}>
          Restaurant not found
        </Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={16}
            color="white"
          />
          <Text style={styles.backButtonText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Success state: show the restaurant ---
  return (
    <View style={styles.flexContainer}>
      <FlatList
        style={styles.container}
        data={restaurant.menu}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <RestaurantHeader restaurant={restaurant} />
        }
        renderItem={({ item }) => (
          <MenuItemCard
            item={item}
            restaurant={restaurant}
            onPress={() => console.log(`Tapped: ${item.name}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <FloatingCartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.light.background,
    paddingHorizontal: 24,
  },

  loadingText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },

  notFoundEmoji: {
    fontSize: 56,
  },

  notFoundText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },

  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
    marginTop: 8,
  },

  backButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
});