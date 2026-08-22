import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  const [reloadRestaurants, setReloadRestaurants] = useState<(() => void) | null>(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Reload the restaurants if the function is available
    if (reloadRestaurants) {
      reloadRestaurants();
    }
    // Simulate a short delay so the user sees the spinner
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [reloadRestaurants]);

  // If not logged in, redirect straight to the login screen
  if (!user) {
    return <Redirect href="/auth/login" />;
  }
  return (

    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
      >
        <HomeHeader />
        <SearchBar />
        <CategoryList />
        <RestaurantList onRefreshReady={setReloadRestaurants} />
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
