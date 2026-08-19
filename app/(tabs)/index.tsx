import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import HomeHeader from '../../src/components/HomeHeader';
import SearchBar from '../../src/components/SearchBar';
import CategoryList from '../../src/components/CategoryList';
import RestaurantList from '../../src/components/RestaurantList';
import Colors from '../../src/constants/Colors';
import FloatingCartButton from '../../src/components/FloatingCartButton';

export default function HomeScreen() {
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
