import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useProfile, useUpdateProfile } from '../../src/hooks/queries';
import { getErrorMessage } from '../../src/lib/format';
import { isValidPhone } from '../../src/lib/validation';
import { makeStyles } from '../../src/theme';
import { BottomBar, Button, LoadingState, TextField } from '../../src/ui';

export default function EditProfileScreen() {
  const styles = useStyles();
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

  if (isLoading) return <LoadingState />;

  const handleSave = () => {
    const next: typeof errors = {};
    if (fullName.trim().length < 2) next.fullName = 'Enter your full name.';
    if (phone.trim() && !isValidPhone(phone)) next.phone = 'Enter a valid Nigerian phone number.';
    setErrors(next);
    if (Object.keys(next).length) return;

    update.mutate(
      { fullName, phone },
      { onSuccess: () => router.back(), onError: (e) => Alert.alert('Could not save', getErrorMessage(e)) }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <TextField
          label="Full name"
          icon="person-outline"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          autoComplete="name"
          error={errors.fullName}
        />
        <TextField
          label="Phone number"
          icon="call-outline"
          value={phone}
          onChangeText={setPhone}
          placeholder="0803 123 4567"
          keyboardType="phone-pad"
          autoComplete="tel"
          hint="Riders use this to reach you."
          error={errors.phone}
        />
      </ScrollView>
      <BottomBar>
        <Button title="Save changes" onPress={handleSave} loading={update.isPending} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  content: { padding: t.spacing.xl },
}));
