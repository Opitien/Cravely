import React from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useOrders } from '../../src/hooks/queries';
import OrderCard from '../../src/components/OrderCard';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/ScreenState';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';
import { getErrorMessage } from '../../src/lib/format';

export default function OrdersScreen() {
  const router = useRouter();
  const { data: orders, isLoading, error, refetch, isRefetching } = useOrders();

  const renderBody = () => {
    if (isLoading) return <LoadingState message="Loading your orders..." />;
    if (error && !orders) {
      return <ErrorState message={getErrorMessage(error, 'Could not load your orders.')} onRetry={refetch} />;
    }
    if (!orders || orders.length === 0) {
      return (
        <EmptyState
          emoji="🛵"
          title="No orders yet!"
          subtitle="Your order history will appear here once you place your first order."
          actionLabel="Browse Restaurants"
          onAction={() => router.navigate('/')}
        />
      );
    }
    return (
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <OrderCard order={item} onPress={() => router.push(`/orders/${item.id}`)} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[Colors.light.primary]}
            tintColor={Colors.light.primary}
          />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        {orders && orders.length > 0 && (
          <Text style={styles.headerSub}>
            {orders.length} order{orders.length !== 1 ? 's' : ''}
          </Text>
        )}
      </View>
      {renderBody()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: '#111',
  },
  headerSub: {
    fontSize: Typography.sizes.small,
    color: '#999',
    marginTop: 2,
  },
  list: {
    padding: 20,
    gap: 20,
  },
});
