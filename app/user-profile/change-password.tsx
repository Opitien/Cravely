import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { FormField, PrimaryButton } from '../../src/components/Form';
import Colors from '../../src/constants/Colors';
import { getErrorMessage } from '../../src/lib/format';
import { MIN_PASSWORD_LENGTH } from '../../src/lib/validation';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { updatePassword, isPasswordRecovery, clearPasswordRecovery } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // If the user backs out of a reset flow, don't keep redirecting them here.
  useEffect(() => () => clearPasswordRecovery(), [clearPasswordRecovery]);

  const handleSave = async () => {
    if (password.length < MIN_PASSWORD_LENGTH) {
      Alert.alert(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords do not match.');
      return;
    }
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {isPasswordRecovery && <Text style={styles.hint}>Choose a new password for your account.</Text>}
        <FormField
          label="New password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
        />
        <FormField
          label="Confirm new password"
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry
          autoComplete="new-password"
          textContentType="newPassword"
          onSubmitEditing={handleSave}
        />
        <PrimaryButton title="Update password" onPress={handleSave} loading={isSaving} style={{ marginTop: 8 }} />
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
  hint: {
    fontSize: 15,
    color: Colors.light.textMuted,
    marginBottom: 20,
  },
});
