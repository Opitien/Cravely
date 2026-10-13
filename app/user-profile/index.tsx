import React from 'react';
import { Alert, Linking, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../src/context/AuthContext';
import { useAddresses, useFavorites, useOrders, useProfile } from '../../src/hooks/queries';
import { deleteAccount } from '../../src/services/api';
import { avatarUrlFor } from '../../src/components/HomeHeader';
import Links from '../../src/constants/Links';
import { getErrorMessage } from '../../src/lib/format';
import { makeStyles } from '../../src/theme';
import { Button, Card, ListRow, Text } from '../../src/ui';

export default function UserProfileScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { favoriteIds } = useFavorites();
  const { data: orders } = useOrders();
  const { data: addresses } = useAddresses();

  const removeAccount = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => signOut().catch(() => undefined),
    onError: (e) => Alert.alert('Could not delete account', getErrorMessage(e)),
  });

  const handleLogout = () =>
    Alert.alert('Log out?', undefined, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        // The auth guard sends us back to the login screen once the session is gone.
        onPress: () => signOut().catch((e) => Alert.alert('Could not log out', getErrorMessage(e))),
      },
    ]);

  const handleDeleteAccount = () =>
    Alert.alert(
      'Delete your account?',
      'This permanently deletes your account, saved addresses, favourites and order history. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeAccount.mutate() },
      ]
    );

  const defaultAddress = addresses?.find((a) => a.isDefault) ?? addresses?.[0];
  const name = profile?.fullName || user?.email?.split('@')[0] || '';
  const stats = [
    { label: 'Orders', value: orders?.length ?? 0 },
    { label: 'Saved', value: favoriteIds.length },
    { label: 'Addresses', value: addresses?.length ?? 0 },
  ];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.identity}>
        <Image source={{ uri: avatarUrlFor(name, profile?.avatarUrl) }} style={styles.avatar} transition={200} />
        <Text variant="title" center style={{ marginTop: 12 }}>
          {name}
        </Text>
        <Text tone="secondary" center>
          {user?.email}
        </Text>
        {profile?.phone ? (
          <Text variant="caption" tone="muted" center>
            {profile.phone}
          </Text>
        ) : null}
        <Button
          title="Edit profile"
          variant="secondary"
          size="md"
          icon="create-outline"
          onPress={() => router.push('/user-profile/edit')}
          style={{ marginTop: 16, alignSelf: 'center' }}
        />
      </View>

      <Card style={styles.stats}>
        {stats.map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <View style={styles.statDivider} />}
            <View style={styles.stat}>
              <Text variant="title" tone="primary">
                {s.value}
              </Text>
              <Text variant="caption" tone="muted">
                {s.label}
              </Text>
            </View>
          </React.Fragment>
        ))}
      </Card>

      <Text variant="overline" tone="muted" style={styles.group}>
        Account
      </Text>
      <Card padded={false} style={styles.list}>
        <ListRow
          icon="location-outline"
          title="Delivery addresses"
          value={defaultAddress?.city}
          onPress={() => router.push('/user-profile/addresses')}
        />
        <ListRow icon="receipt-outline" title="Order history" onPress={() => router.navigate('/orders')} />
        <ListRow icon="lock-closed-outline" title="Change password" onPress={() => router.push('/user-profile/change-password')} last />
      </Card>

      <Text variant="overline" tone="muted" style={styles.group}>
        Support
      </Text>
      <Card padded={false} style={styles.list}>
        <ListRow icon="help-circle-outline" title="Help & support" onPress={() => Linking.openURL(`mailto:${Links.supportEmail}`)} />
        <ListRow icon="shield-checkmark-outline" title="Privacy policy" onPress={() => WebBrowser.openBrowserAsync(Links.privacyPolicy)} />
        <ListRow icon="document-text-outline" title="Terms of service" onPress={() => WebBrowser.openBrowserAsync(Links.terms)} last />
      </Card>

      <Card padded={false} style={[styles.list, { marginTop: 24 }]}>
        <ListRow icon="log-out-outline" title="Log out" onPress={handleLogout} destructive />
        <ListRow
          icon="trash-outline"
          title={removeAccount.isPending ? 'Deleting account…' : 'Delete account'}
          onPress={removeAccount.isPending ? undefined : handleDeleteAccount}
          destructive
          last
        />
      </Card>

      <Text variant="caption" tone="muted" center style={{ marginTop: 28 }}>
        Cravely v{Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
    </ScrollView>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  content: { padding: t.spacing.xl, paddingTop: t.spacing.sm, paddingBottom: 48 },
  identity: { alignItems: 'center', paddingVertical: t.spacing.lg },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: t.colors.primarySoft,
    backgroundColor: t.colors.skeleton,
  },
  stats: { flexDirection: 'row', marginTop: t.spacing.lg, paddingVertical: t.spacing.lg },
  stat: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: t.colors.border },
  group: { marginTop: t.spacing.xxl, marginBottom: t.spacing.sm, marginLeft: 4 },
  list: { overflow: 'hidden' },
}));
