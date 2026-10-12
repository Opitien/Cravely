import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites, useRestaurantsByIds } from '../../src/hooks/queries';
import RestaurantCard from '../../src/components/RestaurantCard';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/ScreenState';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';
import { getErrorMessage } from '../../src/lib/format';

export default function FavoritesScreen() {
  const router = useRouter();
  const { favoriteIds, isLoading: favoritesLoading, clearFavorites } = useFavorites();
  const restaurants = useRestaurantsByIds(favoriteIds);

  // Keep the list in sync with optimistic un-favouriting before the refetch lands.
  const favoriteRestaurants = (restaurants.data ?? []).filter((r) => favoriteIds.includes(r.id));

  const confirmClear = () => {
    Alert.alert('Clear favourites?', 'This removes every saved restaurant.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearFavorites },
    ]);
  };

  const renderBody = () => {
    if (favoritesLoading || (restaurants.isLoading && favoriteIds.length > 0)) {
      return <LoadingState message="Loading your favourites..." />;
    }
    if (restaurants.error && !restaurants.data) {
      return (
        <ErrorState
          message={getErrorMessage(restaurants.error, 'Could not load your favourites.')}
          onRetry={restaurants.refetch}
        />
      );
    }
    if (favoriteIds.length === 0) {
      return (
        <EmptyState
          emoji="🍽️"
          title="No favourites yet"
          subtitle="Tap the heart on any restaurant to save it here."
          actionLabel="Browse Restaurants"
          onAction={() => router.navigate('/')}
        />
      );
    }
    return (
      <FlatList
        data={favoriteRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard restaurant={item} onPress={() => router.push(`/restaurant/${item.id}`)} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Saved Favourites ❤️</Text>
          <Text style={styles.subtitle}>
            {favoriteIds.length} restaurant{favoriteIds.length !== 1 ? 's' : ''} saved
          </Text>
        </View>
        {favoriteIds.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={confirmClear} accessibilityLabel="Clear all favourites">
            <Ionicons name="trash-outline" size={18} color={Colors.light.primary} />
          </TouchableOpacity>
        )}
      </View>
      {renderBody()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
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
  clearButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.light.primaryTint,
  },
  listContent: {
    paddingTop: 24,
    paddingBottom: 40,
  },
});
