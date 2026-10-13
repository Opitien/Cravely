import React, { useRef, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';
import AuthLayout from '../../src/components/AuthLayout';
import { getErrorMessage } from '../../src/lib/format';
import { EMAIL_PATTERN } from '../../src/lib/validation';
import { makeStyles } from '../../src/theme';
import { Button, Text, TextField } from '../../src/ui';

export default function LoginScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { signIn } = useAuth();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    const next: typeof errors = {};
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Enter your password.';
    setErrors(next);
    if (Object.keys(next).length) return;

    setIsLoading(true);
    try {
      // On success the auth guard in app/_layout.tsx switches to the signed-in screens.
      await signIn(email, password);
    } catch (error) {
      const message = getErrorMessage(error);
      Alert.alert(
        'Sign in failed',
        /email not confirmed/i.test(message)
          ? 'Please confirm your email address using the link we sent you, then sign in.'
          : /invalid login credentials/i.test(message)
            ? 'Incorrect email or password.'
            : message
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back 👋" subtitle="Sign in to continue ordering.">
      <TextField
        label="Email"
        icon="mail-outline"
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
        value={email}
        onChangeText={setEmail}
        onSubmitEditing={() => passwordRef.current?.focus()}
        error={errors.email}
      />
      <TextField
        ref={passwordRef}
        label="Password"
        icon="lock-closed-outline"
        placeholder="Your password"
        password
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="go"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleLogin}
        error={errors.password}
      />

      <Pressable onPress={() => router.push('/auth/forgot-password')} style={styles.forgot} hitSlop={8}>
        <Text variant="label" tone="primary">
          Forgot password?
        </Text>
      </Pressable>

      <Button title="Sign in" onPress={handleLogin} loading={isLoading} />

      <View style={styles.footer}>
        <Text tone="secondary">New to Cravely? </Text>
        <Pressable onPress={() => router.push('/auth/signup')} hitSlop={8}>
          <Text variant="bodyStrong" tone="primary">
            Create an account
          </Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const useStyles = makeStyles((t) => ({
  forgot: { alignSelf: 'flex-end', marginTop: -4, marginBottom: t.spacing.xl },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: t.spacing.xxl },
}));
