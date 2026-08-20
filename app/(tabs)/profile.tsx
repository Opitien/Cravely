import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView, Platform, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../src/context/FavoritesContext';
import { getRestaurants } from '../../src/services/api';
import { Restaurant } from '../../src/types';
import RestaurantCard from '../../src/components/RestaurantCard';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favoriteIds, clearFavorites } = useFavorites();

  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getRestaurants();
      setAllRestaurants(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  // Filter to only favorited restaurants
  const favoriteRestaurants = allRestaurants.filter((r) =>
    favoriteIds.includes(r.id)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Favorites ❤️</Text>
        <Text style={styles.subtitle}>{favoriteRestaurants.length} restaurants saved</Text>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearFavorites}
        >
          <Ionicons
            name="trash-outline"
            size={18}
            color={Colors.light.background}
          />
          <Text style={styles.clearButtonText}> Clear All</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.light.primary} />
          <Text style={styles.emptyText}>Loading your favorites...</Text>
        </View>
      ) : favoriteRestaurants.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyText}>You haven't saved any restaurants yet!</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteRestaurants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RestaurantCard
              restaurant={item}
              onPress={() => router.push(`/restaurant/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    padding: 16,
    paddingTop: 24,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Typography.sizes.medium,
    color: '#888',
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: Typography.sizes.medium,
    color: '#888',
    textAlign: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    backgroundColor: Colors.light.primary,
    paddingVertical: 8,
    borderRadius: 12,
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 16,
    width: 140,
    alignSelf: 'flex-end',
  },
  clearButtonText: {
    fontSize: Typography.sizes.medium,
    color: Colors.light.background,
    textAlign: "center"
  },
});
