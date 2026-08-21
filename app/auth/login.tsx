import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import Colors from '../../src/constants/Colors';
import Typography from '../../src/constants/Typography';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim().includes('@')) {
      Alert.alert('Please enter a valid email.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password must be at least 6 characters.');
      return;
    }
    setIsLoading(true);
    try {
      await login(email.trim(), password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      {/* ── DARK HERO SECTION ── */}
      <View style={styles.hero}>
        <SafeAreaView style={styles.heroInner}>
          <Image
            source={require('../../assets/icon.png')}
            style={styles.logo}
          />
          <Text style={styles.brandName}>CRAVELY</Text>
          <Text style={styles.tagline}>Your cravings, delivered.</Text>
        </SafeAreaView>
      </View>

      {/* ── WHITE FORM CARD ── */}
      <KeyboardAvoidingView
        style={styles.cardWrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome back 👋</Text>
          <Text style={styles.cardSubtitle}>Sign in to continue</Text>

          {/* Email */}
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Password */}
          <View style={styles.inputRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#bbb"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.button, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.buttonText}>Sign In</Text>
            }
          </TouchableOpacity>

          {/* Sign Up link */}
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => router.push('/auth/signup')}
          >
            <Text style={styles.linkText}>Don't have an account? </Text>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const HERO_HEIGHT = height * 0.42;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.light.primary, // dark navy — matches app icon background
  },

  // Hero (top dark section)
  hero: {
    height: HERO_HEIGHT,
    backgroundColor: Colors.light.primary,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  heroInner: {
    alignItems: 'center',
    paddingBottom: 28,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 22,
    marginBottom: 14,
    // subtle orange glow effect via shadow
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  brandName: {
    fontSize: 36,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 4,
    marginBottom: 6,
  },
  tagline: {
    fontSize: Typography.sizes.medium,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.5,
  },

  // White card (bottom section)
  cardWrapper: {
    flex: 1,
  },
  card: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
  },
  cardTitle: {
    fontSize: Typography.sizes.xlarge,
    fontWeight: Typography.weights.bold,
    color: '#111',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: Typography.sizes.medium,
    color: '#999',
    marginBottom: 28,
  },

  // Inputs
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.medium,
    color: '#111',
  },

  // Button
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: Colors.light.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: Typography.sizes.large,
    fontWeight: Typography.weights.bold,
    letterSpacing: 0.5,
  },

  // Link
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  linkText: {
    color: '#999',
    fontSize: Typography.sizes.medium,
  },
  link: {
    color: Colors.light.primary,
    fontWeight: Typography.weights.bold,
    fontSize: Typography.sizes.medium,
  },
});
