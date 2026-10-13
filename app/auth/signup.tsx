import React, { useRef, useState } from 'react';
import { Alert, Pressable, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useAuth } from '../../src/context/AuthContext';
import AuthLayout from '../../src/components/AuthLayout';
import Links from '../../src/constants/Links';
import { getErrorMessage } from '../../src/lib/format';
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH } from '../../src/lib/validation';
import { makeStyles } from '../../src/theme';
import { Button, Text, TextField } from '../../src/ui';

type Errors = Partial<Record<'name' | 'email' | 'password', string>>;

export default function SignUpScreen() {
  const styles = useStyles();
  const router = useRouter();
  const { signUp } = useAuth();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    const next: Errors = {};
    if (name.trim().length < 2) next.name = 'Enter your full name.';
    if (!EMAIL_PATTERN.test(email.trim())) next.email = 'Enter a valid email address.';
    if (password.length < MIN_PASSWORD_LENGTH) next.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    setErrors(next);
    if (Object.keys(next).length) return;

    setIsLoading(true);
    try {
      const { needsConfirmation } = await signUp(name, email, password);
      if (needsConfirmation) {
        Alert.alert(
          'Check your email',
          `We sent a confirmation link to ${email.trim()}. Open it on this phone to finish creating your account.`,
          [{ text: 'OK', onPress: () => router.replace('/auth/login') }]
        );
      }
      // Otherwise we're signed in and the auth guard moves us into the app.
    } catch (error) {
      Alert.alert('Sign up failed', getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="It takes less than a minute.">
      <TextField
        label="Full name"
        icon="person-outline"
        placeholder="Ada Obi"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        value={name}
        onChangeText={setName}
        onSubmitEditing={() => emailRef.current?.focus()}
        error={errors.name}
      />
      <TextField
        ref={emailRef}
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
        placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
        password
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="go"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={handleSignUp}
        error={errors.password}
      />

      <Button title="Create account" onPress={handleSignUp} loading={isLoading} style={{ marginTop: 4 }} />

      <Text variant="caption" tone="muted" center style={styles.legal}>
        By continuing you agree to our{' '}
        <Text variant="caption" tone="primary" onPress={() => WebBrowser.openBrowserAsync(Links.terms)}>
          Terms
        </Text>{' '}
        and{' '}
        <Text variant="caption" tone="primary" onPress={() => WebBrowser.openBrowserAsync(Links.privacyPolicy)}>
          Privacy Policy
        </Text>
        .
      </Text>

      <View style={styles.footer}>
        <Text tone="secondary">Already have an account? </Text>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/auth/login'))}
          hitSlop={8}
        >
          <Text variant="bodyStrong" tone="primary">
            Sign in
          </Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const useStyles = makeStyles((t) => ({
  legal: { marginTop: t.spacing.lg },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: t.spacing.xl },
}));
