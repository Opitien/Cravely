import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { getErrorMessage } from '../../src/lib/format';
import { EMAIL_PATTERN } from '../../src/lib/validation';
import { makeStyles, useTheme } from '../../src/theme';
import { Button, Text, TextField } from '../../src/ui';

export default function ForgotPasswordScreen() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Enter a valid email address.');
      return;
    }
    setError(undefined);
    setIsLoading(true);
    try {
      await resetPassword(email);
      // Same message whether or not the account exists, so emails can't be enumerated.
      Alert.alert(
        'Check your email',
        'If an account exists for that address, we sent a link to reset your password. Open it on this phone.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e) {
      Alert.alert('Something went wrong', getErrorMessage(e));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.icon}>
        <Ionicons name="key" size={30} color={t.colors.primary} />
      </View>
      <Text variant="title">Forgot your password?</Text>
      <Text tone="secondary" style={styles.subtitle}>
        Enter the email you signed up with and we’ll send you a link to reset it.
      </Text>
      <TextField
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={handleSubmit}
        error={error}
      />
      <Button title="Send reset link" onPress={handleSubmit} loading={isLoading} />
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background, padding: t.spacing.xxl, paddingTop: t.spacing.md },
  icon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: t.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: t.spacing.xl,
  },
  subtitle: { marginTop: t.spacing.sm, marginBottom: t.spacing.xxl },
}));
