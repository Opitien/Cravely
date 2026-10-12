import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useProfile, useUpdateProfile } from '../../src/hooks/queries';
import { FormField, PrimaryButton } from '../../src/components/Form';
import { LoadingState } from '../../src/components/ScreenState';
import Colors from '../../src/constants/Colors';
import { getErrorMessage } from '../../src/lib/format';
import { isValidPhone } from '../../src/lib/validation';

export default function EditProfileScreen() {
  const router = useRouter();
  const { data: profile, isLoading } = useProfile();
  const update = useUpdateProfile();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ fullName?: string; phone?: string }>({});

  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName);
      setPhone(profile.phone ?? '');
    }
  }, [profile]);

  if (isLoading) return <LoadingState style={styles.container} />;

  const handleSave = () => {
    const next: typeof errors = {};
    if (fullName.trim().length < 2) next.fullName = 'Please enter your full name.';
    if (phone.trim() && !isValidPhone(phone)) next.phone = 'Enter a valid Nigerian phone number.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    update.mutate(
      { fullName, phone },
      {
        onSuccess: () => router.back(),
        onError: (e) => Alert.alert('Could not save', getErrorMessage(e)),
      }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FormField
          label="Full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          autoComplete="name"
          error={errors.fullName}
        />
        <FormField
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          placeholder="0803 123 4567"
          keyboardType="phone-pad"
          autoComplete="tel"
          error={errors.phone}
        />
        <PrimaryButton title="Save changes" onPress={handleSave} loading={update.isPending} style={{ marginTop: 8 }} />
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
  },
});
