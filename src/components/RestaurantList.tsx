import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import RestaurantCard from './RestaurantCard';
import { mockRestaurants } from '../utils/mockData';
import Typography from '../constants/Typography';
import Colors from '../constants/Colors';

export default function RestaurantList() {
  // useRouter gives us the ability to navigate programmatically
  const router = useRouter();

  const handlePress = (restaurantId: string) => {
    // Navigate to /restaurant/[id] — Expo Router reads the id from the URL
    router.push(`/restaurant/${restaurantId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Popular near you</Text>
        <Text style={styles.seeAll}>See all</Text>
      </View>

      {mockRestaurants.map((restaurant) => (
        <RestaurantCard 
          key={restaurant.id} 
          restaurant={restaurant} 
          onPress={() => handlePress(restaurant.id)} 
        />
      ))}
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
});
