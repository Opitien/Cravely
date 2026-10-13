import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateAddress, useProfile } from '../../src/hooks/queries';
import { getErrorMessage } from '../../src/lib/format';
import { isValidPhone } from '../../src/lib/validation';
import { makeStyles, useTheme } from '../../src/theme';
import { BottomBar, Button, Chip, Text, TextField } from '../../src/ui';

type Errors = Partial<Record<'line1' | 'city' | 'state' | 'phone', string>>;
const LABELS = ['Home', 'Work', 'Other'];

export default function NewAddressScreen() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const { data: profile } = useProfile();
  const create = useCreateAddress();

  const [label, setLabel] = useState('Home');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [instructions, setInstructions] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const handleSave = () => {
    const next: Errors = {};
    if (line1.trim().length < 5) next.line1 = 'Enter your street address.';
    if (!city.trim()) next.city = 'Required';
    if (!state.trim()) next.state = 'Required';
    if (!isValidPhone(phone)) next.phone = 'Enter a valid Nigerian phone number for the rider.';
    setErrors(next);
    if (Object.keys(next).length) return;

    create.mutate(
      { label, line1, city, state, phone, instructions: instructions || null, isDefault },
      { onSuccess: () => router.back(), onError: (e) => Alert.alert('Could not save address', getErrorMessage(e)) }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text variant="label" tone="secondary" style={styles.labelTitle}>
          Save as
        </Text>
        <View style={styles.labels}>
          {LABELS.map((l) => (
            <Chip key={l} label={l} selected={label === l} onPress={() => setLabel(l)} />
          ))}
        </View>

        <TextField
          label="Street address"
          icon="location-outline"
          value={line1}
          onChangeText={setLine1}
          placeholder="12 Admiralty Way, Lekki Phase 1"
          autoComplete="street-address"
          error={errors.line1}
        />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <TextField label="City" value={city} onChangeText={setCity} placeholder="Lagos" error={errors.city} />
          </View>
          <View style={{ flex: 1 }}>
            <TextField label="State" value={state} onChangeText={setState} placeholder="Lagos" error={errors.state} />
          </View>
        </View>
        <TextField
          label="Phone for delivery"
          icon="call-outline"
          value={phone}
          onChangeText={setPhone}
          placeholder="0803 123 4567"
          keyboardType="phone-pad"
          autoComplete="tel"
          error={errors.phone}
        />
        <TextField
          label="Directions for the rider (optional)"
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Gate code, landmark, floor…"
          multiline
          maxLength={200}
        />

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong">Make default</Text>
            <Text variant="caption" tone="muted">
              Used automatically at checkout
            </Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ true: t.colors.primary, false: t.colors.borderStrong }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>
      <BottomBar>
        <Button title="Save address" onPress={handleSave} loading={create.isPending} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  content: { padding: t.spacing.xl },
  labelTitle: { marginBottom: t.spacing.sm, marginLeft: 2 },
  labels: { flexDirection: 'row', gap: t.spacing.sm, marginBottom: t.spacing.xl },
  row: { flexDirection: 'row', gap: t.spacing.md },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    padding: t.spacing.lg,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    ...t.shadow(1),
  },
}));
