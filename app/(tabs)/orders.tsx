import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Image,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useOrders, Order, OrderStatus } from '../../src/context/OrdersContext';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';

// Maps an order status to a color and icon
function getStatusStyle(status: OrderStatus) {
  switch (status) {
    case 'Preparing':
      return { color: '#F59E0B', icon: 'flame-outline' as const };
    case 'On the way':
      return { color: '#3B82F6', icon: 'bicycle-outline' as const };
    case 'Delivered':
      return { color: '#22C55E', icon: 'checkmark-circle-outline' as const };
  }
}

// A single order card component
function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const statusStyle = getStatusStyle(order.status);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {/* Restaurant image + info */}
        <View style={styles.cardTop}>
          <Image source={{ uri: order.restaurantImage }} style={styles.restaurantImage} />
          <View style={styles.cardInfo}>
            <Text style={styles.restaurantName} numberOfLines={1}>{order.restaurantName}</Text>
            <Text style={styles.orderMeta}>{order.date}</Text>
            <Text style={styles.orderMeta}>{order.items.length} item{order.items.length > 1 ? 's' : ''} · ₦{order.total.toLocaleString()}</Text>
          </View>
          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.color + '20' }]}>
            <Ionicons name={statusStyle.icon} size={14} color={statusStyle.color} />
            <Text style={[styles.statusText, { color: statusStyle.color }]}>{order.status}</Text>
          </View>
        </View >

        {/* Items preview */}
        < View style={styles.itemsRow} >
          <Text style={styles.itemsPreview} numberOfLines={1}>
            {order.items.map((i) => i.name).join(', ')}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </View >

        {/* Payment method */}
        < View style={styles.paymentRow} >
          <Ionicons name="card-outline" size={14} color="#999" />
          <Text style={styles.paymentText}>{order.paymentMethod}</Text>
          <Text style={styles.orderId}>{order.id}</Text>
        </View >
      </TouchableOpacity >
      <TouchableOpacity
        onPress={() =>
          Alert.alert('Coming soon!', 'Reorder will be available soon!')
        }
        style={styles.reorderButton}
      >
        <Text style={styles.reorderButtonText}>Reorder</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function OrdersScreen() {
  const router = useRouter();
  const { orders } = useOrders();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerSub}>
          {orders.length} order{orders.length !== 1 ? 's' : ''} placed
        </Text>
      </View>

      {orders.length === 0 ? (
        /* Empty state */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛵</Text>
          <Text style={styles.emptyTitle}>No orders yet!</Text>
          <Text style={styles.emptySubtitle}>
            Your order history will appear here once you place your first order.
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() =>
                // In a real app, this would navigate to the order detail screen
                // For now we show a simple alert
                Alert.alert(
                  `Order ${item.id}`,
                  `Status: ${item.status}\nTotal: ₦${item.total.toLocaleString()}\nPaid by: ${item.paymentMethod}`
                )
              }
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
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

  // Order Card
  list: {
    padding: 16,
    gap: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
  },
  restaurantName: {
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
    color: '#111',
    marginBottom: 2,
  },
  orderMeta: {
    fontSize: Typography.sizes.small,
    color: '#888',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: Typography.weights.bold,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  itemsPreview: {
    flex: 1,
    fontSize: Typography.sizes.small,
    color: '#666',
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  paymentText: {
    fontSize: Typography.sizes.small,
    color: '#999',
    flex: 1,
    textTransform: 'capitalize',
  },
  orderId: {
    fontSize: Typography.sizes.small,
    color: '#ccc',
    fontWeight: Typography.weights.bold,
  },
  reorderButton: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginTop: 12,
  },

  reorderButtonText: {
    color: Colors.light.primary,
    fontSize: Typography.sizes.small,
    fontWeight: Typography.weights.bold,
  },

  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: '#111',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: Typography.sizes.medium,
    color: '#888',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  browseButton: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 28,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    color: 'white',
    fontSize: Typography.sizes.medium,
    fontWeight: Typography.weights.bold,
  },
});
