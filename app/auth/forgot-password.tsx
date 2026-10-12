import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import { FormField, PrimaryButton } from '../../src/components/Form';
import Colors from '../../src/constants/Colors';
import { getErrorMessage } from '../../src/lib/format';
import { EMAIL_PATTERN } from '../../src/lib/validation';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!EMAIL_PATTERN.test(email.trim())) {
      Alert.alert('Please enter a valid email.');
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email);
      // Same message whether or not the account exists, so emails can't be enumerated.
      Alert.alert(
        'Check your email',
        'If an account exists for that address, we sent a link to reset your password. Open it on this phone.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      Alert.alert('Something went wrong', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>Enter the email you signed up with and we'll send you a reset link.</Text>
        <FormField
          label="Email address"
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={handleSubmit}
        />
        <PrimaryButton title="Send reset link" onPress={handleSubmit} loading={isLoading} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  inner: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.light.textMuted,
    marginBottom: 24,
    lineHeight: 21,
  },
});
