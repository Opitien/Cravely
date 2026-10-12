import React, { useState } from 'react';
import { ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, View, Text, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useCreateAddress, useProfile } from '../../src/hooks/queries';
import { FormField, PrimaryButton } from '../../src/components/Form';
import Colors from '../../src/constants/Colors';
import { getErrorMessage } from '../../src/lib/format';
import { isValidPhone } from '../../src/lib/validation';

type Errors = Partial<Record<'line1' | 'city' | 'state' | 'phone', string>>;

export default function NewAddressScreen() {
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
    if (!city.trim()) next.city = 'Enter your city.';
    if (!state.trim()) next.state = 'Enter your state.';
    if (!isValidPhone(phone)) next.phone = 'Enter a valid Nigerian phone number for the rider.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    create.mutate(
      { label, line1, city, state, phone, instructions: instructions || null, isDefault },
      {
        onSuccess: () => router.back(),
        onError: (e) => Alert.alert('Could not save address', getErrorMessage(e)),
      }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FormField label="Label" value={label} onChangeText={setLabel} placeholder="Home, Work…" />
        <FormField
          label="Street address"
          value={line1}
          onChangeText={setLine1}
          placeholder="12 Admiralty Way, Lekki Phase 1"
          autoComplete="street-address"
          error={errors.line1}
        />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <FormField label="City" value={city} onChangeText={setCity} placeholder="Lagos" error={errors.city} />
          </View>
          <View style={{ flex: 1 }}>
            <FormField label="State" value={state} onChangeText={setState} placeholder="Lagos" error={errors.state} />
          </View>
        </View>
        <FormField
          label="Phone for delivery"
          value={phone}
          onChangeText={setPhone}
          placeholder="0803 123 4567"
          keyboardType="phone-pad"
          autoComplete="tel"
          error={errors.phone}
        />
        <FormField
          label="Delivery instructions (optional)"
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Gate code, landmark, floor…"
          multiline
          maxLength={200}
        />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Set as default address</Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ true: Colors.light.primary, false: '#DDD' }}
            thumbColor="white"
          />
        </View>
        <PrimaryButton title="Save address" onPress={handleSave} loading={create.isPending} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  switchLabel: {
    fontSize: 15,
    color: Colors.light.text,
  },
});
