import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { getErrorMessage } from '../../src/lib/format';
import { MIN_PASSWORD_LENGTH } from '../../src/lib/validation';
import { makeStyles } from '../../src/theme';
import { BottomBar, Button, Text, TextField } from '../../src/ui';

export default function ChangePasswordScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { updatePassword, isPasswordRecovery, clearPasswordRecovery } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [isSaving, setIsSaving] = useState(false);

  // If the user backs out of a reset flow, don't keep redirecting them here.
  useEffect(() => () => clearPasswordRecovery(), [clearPasswordRecovery]);

  const handleSave = async () => {
    const next: typeof errors = {};
    if (password.length < MIN_PASSWORD_LENGTH) next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (password !== confirm) next.confirm = 'Passwords do not match.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setIsSaving(true);
    try {
      await updatePassword(password);
      Alert.alert('Password updated', 'Your new password is now active.', [
        { text: 'OK', onPress: () => (router.canGoBack() ? router.back() : router.replace('/')) },
      ]);
    } catch (e) {
      Alert.alert('Could not update password', getErrorMessage(e));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {isPasswordRecovery && (
          <Text tone="secondary" style={styles.hint}>
            Choose a new password for your account.
          </Text>
        )}
        <TextField
          label="New password"
          icon="lock-closed-outline"
          password
          value={password}
          onChangeText={setPassword}
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
          error={errors.password}
        />
        <TextField
          label="Confirm new password"
          icon="lock-closed-outline"
          password
          value={confirm}
          onChangeText={setConfirm}
          autoComplete="new-password"
          textContentType="newPassword"
          onSubmitEditing={handleSave}
          error={errors.confirm}
        />
      </ScrollView>
      <BottomBar>
        <Button title="Update password" onPress={handleSave} loading={isSaving} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  content: { padding: t.spacing.xl },
  hint: { marginBottom: t.spacing.xl },
}));
