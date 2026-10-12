import React from 'react';
import { View, StyleSheet, FlatList, Alert, ActionSheetIOS, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from '../../src/hooks/queries';
import AddressCard from '../../src/components/AddressCard';
import { PrimaryButton } from '../../src/components/Form';
import { EmptyState, ErrorState, LoadingState } from '../../src/components/ScreenState';
import { Address } from '../../src/types';
import Colors from '../../src/constants/Colors';
import { getErrorMessage } from '../../src/lib/format';

export default function AddressesScreen() {
  const router = useRouter();
  const { data: addresses, isLoading, error, refetch } = useAddresses();
  const setDefault = useSetDefaultAddress();
  const remove = useDeleteAddress();

  const onError = (e: unknown) => Alert.alert('Something went wrong', getErrorMessage(e));

  const showOptions = (address: Address) => {
    const makeDefault = () => setDefault.mutate(address.id, { onError });
    const confirmDelete = () =>
      Alert.alert('Delete address?', address.line1, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => remove.mutate(address.id, { onError }) },
      ]);

    const options = [
      ...(address.isDefault ? [] : [{ text: 'Set as default', onPress: makeDefault }]),
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
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  };

  if (isLoading) return <LoadingState style={styles.container} />;
  if (error && !addresses) {
    return <ErrorState message={getErrorMessage(error)} onRetry={refetch} style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      {!addresses || addresses.length === 0 ? (
        <EmptyState
          emoji="📍"
          title="No saved addresses"
          subtitle="Add an address so we know where to deliver your food."
          actionLabel="Add Address"
          onAction={() => router.push('/user-profile/address-new')}
        />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(a) => a.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <AddressCard address={item} actionLabel="Edit" onAction={() => showOptions(item)} />
          )}
          ListFooterComponent={
            <PrimaryButton
              title="Add New Address"
              variant="outline"
              onPress={() => router.push('/user-profile/address-new')}
              style={{ marginTop: 8 }}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  list: {
    padding: 16,
  },
});
