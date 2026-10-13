import React from 'react';
import { ActionSheetIOS, Alert, FlatList, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from '../../src/hooks/queries';
import AddressCard from '../../src/components/AddressCard';
import { Address } from '../../src/types';
import { getErrorMessage } from '../../src/lib/format';
import { makeStyles } from '../../src/theme';
import { BottomBar, Button, EmptyState, ErrorState, ListRowSkeleton } from '../../src/ui';

export default function AddressesScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { data: addresses, isLoading, error, refetch } = useAddresses();
  const setDefault = useSetDefaultAddress();
  const remove = useDeleteAddress();

  const onError = (e: unknown) => Alert.alert('Something went wrong', getErrorMessage(e));

  const showOptions = (address: Address) => {
    const makeDefault = () => setDefault.mutate(address.id, { onError });
    const confirmDelete = () =>
      Alert.alert('Delete this address?', address.line1, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => remove.mutate(address.id, { onError }) },
      ]);

    const options = [
      ...(address.isDefault ? [] : [{ text: 'Set as default', onPress: makeDefault, destructive: false }]),
      { text: 'Delete', onPress: confirmDelete, destructive: true },
    ];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...options.map((o) => o.text), 'Cancel'],
          destructiveButtonIndex: options.findIndex((o) => o.destructive),
          cancelButtonIndex: options.length,
        },
        (index) => options[index]?.onPress()
      );
    } else {
      Alert.alert(address.label, address.line1, [
        ...options.map((o) => ({ text: o.text, onPress: o.onPress, style: o.destructive ? ('destructive' as const) : undefined })),
        { text: 'Cancel', style: 'cancel' as const },
      ]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.screen}>
        {[0, 1].map((i) => (
          <ListRowSkeleton key={i} />
        ))}
      </View>
    );
  }
  if (error && !addresses) return <ErrorState message={getErrorMessage(error)} onRetry={refetch} />;

  if (!addresses || addresses.length === 0) {
    return (
      <EmptyState
        emoji="📍"
        title="No saved addresses"
        subtitle="Add an address so we know where to bring your food."
        actionLabel="Add address"
        onAction={() => router.push('/user-profile/address-new')}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <FlatList
        data={addresses}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AddressCard address={item} actionIcon="ellipsis-horizontal" onAction={() => showOptions(item)} />
        )}
      />
      <BottomBar>
        <Button title="Add new address" icon="add" variant="secondary" onPress={() => router.push('/user-profile/address-new')} />
      </BottomBar>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  list: { padding: t.spacing.xl, paddingTop: t.spacing.sm },
}));
