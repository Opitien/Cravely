import React from 'react';
import { RefreshControl, SectionList, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useOrders } from '../../src/hooks/queries';
import OrderCard from '../../src/components/OrderCard';
import { getErrorMessage, isActiveOrder } from '../../src/lib/format';
import { makeStyles, useTheme } from '../../src/theme';
import { EmptyState, ErrorState, LargeTitle, ListRowSkeleton, Screen, Text } from '../../src/ui';

export default function OrdersScreen() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const { data: orders, isLoading, error, refetch, isRefetching } = useOrders();

  const renderBody = () => {
    if (isLoading) {
      return (
        <View style={{ paddingHorizontal: t.spacing.sm }}>
          {[0, 1, 2, 3].map((i) => (
            <ListRowSkeleton key={i} />
          ))}
        </View>
      );
    }
    if (error && !orders) {
      return <ErrorState message={getErrorMessage(error, 'Could not load your orders.')} onRetry={refetch} />;
    }
    if (!orders || orders.length === 0) {
      return (
        <EmptyState
          emoji="🛵"
          title="No orders yet"
          subtitle="When you place an order, you can track it here."
          actionLabel="Find something to eat"
          onAction={() => router.navigate('/')}
        />
      );
    }

    const active = orders.filter((o) => isActiveOrder(o.status));
    const past = orders.filter((o) => !isActiveOrder(o.status));
    const sections = [
      ...(active.length ? [{ title: 'In progress', data: active }] : []),
      ...(past.length ? [{ title: 'Past orders', data: past }] : []),
    ];

    return (
      <SectionList
        sections={sections}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        renderSectionHeader={({ section }) => (
          <Text variant="overline" tone="muted" style={styles.sectionTitle}>
            {section.title}
          </Text>
        )}
        renderItem={({ item }) => <OrderCard order={item} onPress={() => router.push(`/orders/${item.id}`)} />}
        ItemSeparatorComponent={() => <View style={{ height: t.spacing.md }} />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={t.colors.primary} colors={[t.colors.primary]} />
        }
      />
    );
  };

  return (
    <Screen>
      <LargeTitle title="Orders" />
      {renderBody()}
    </Screen>
  );
}

const useStyles = makeStyles((t) => ({
  list: { paddingHorizontal: t.spacing.xl, paddingBottom: t.spacing.xxxl },
  sectionTitle: { marginTop: t.spacing.sm, marginBottom: t.spacing.md },
}));
