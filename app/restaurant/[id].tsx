import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { mockRestaurants } from '../../src/utils/mockData';
import RestaurantHeader from '../../src/components/RestaurantHeader';
import MenuItemCard from '../../src/components/MenuItemCard';
import FloatingCartButton from '../../src/components/FloatingCartButton';
import Colors from '../../src/constants/Colors';

export default function RestaurantScreen() {
  // useLocalSearchParams reads the [id] from the URL
  // e.g., navigating to /restaurant/3 gives us { id: '3' }
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Find the restaurant that matches the id from the URL
  const restaurant = mockRestaurants.find((r) => r.id === id);

  // If no restaurant matches, show an error message
  if (!restaurant) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Restaurant not found <Text style={styles.notFoundEmoji}>😕</Text> </Text>
        <Button color={Colors.light.primary} title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View style={styles.flexContainer}>
      <FlatList
        style={styles.container}
        // The restaurant's menu items are the main list data
        data={restaurant.menu}
        keyExtractor={(item) => item.id}
        // ListHeaderComponent renders ABOVE the list items
        // This is how we put the hero image + info above the menu
        ListHeaderComponent={<RestaurantHeader restaurant={restaurant} />}
        // Each item in the list renders a MenuItemCard
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
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 30,
    color: '#666',
  },
  notFoundEmoji: {
    color: 'red',
    fontSize: 50,
  }
});
