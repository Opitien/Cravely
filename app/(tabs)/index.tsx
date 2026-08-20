import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Redirect } from 'expo-router';
import HomeHeader from '../../src/components/HomeHeader';
import SearchBar from '../../src/components/SearchBar';
import CategoryList from '../../src/components/CategoryList';
import RestaurantList from '../../src/components/RestaurantList';
import Colors from '../../src/constants/Colors';
import FloatingCartButton from '../../src/components/FloatingCartButton';
import { useAuth } from '../../src/context/AuthContext';

export default function HomeScreen() {
  const { user } = useAuth();

  // If not logged in, redirect straight to the login screen
  if (!user) {
    return <Redirect href="/auth/login" />;
  }
  return (

    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader />
        <SearchBar />
        <CategoryList />
        <RestaurantList />
      </ScrollView>

      <FloatingCartButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
