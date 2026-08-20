import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../src/context/FavoritesContext';
import { mockRestaurants } from '../../src/utils/mockData';
import RestaurantCard from '../../src/components/RestaurantCard';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favoriteIds } = useFavorites();

  // Filter the mock data to only include restaurants whose ID is in our favorites list
  const favoriteRestaurants = mockRestaurants.filter((restaurant) => 
    favoriteIds.includes(restaurant.id)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Favorites ❤️</Text>
        <Text style={styles.subtitle}>{favoriteRestaurants.length} restaurants saved</Text>
      </View>

      {favoriteRestaurants.length === 0 ? (
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
});
