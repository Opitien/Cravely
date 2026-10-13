import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles } from '../theme';
import { Text } from '../ui';

/** Coral brand header with the form on a rounded sheet below. Shared by login/sign-up. */
export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
          {/* Decorative food emoji, hidden from screen readers */}
          <View style={styles.decor} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            <Text style={[styles.food, { top: insets.top + 8, left: 24, transform: [{ rotate: '-14deg' }] }]}>🍔</Text>
            <Text style={[styles.food, { top: insets.top + 40, right: 28, transform: [{ rotate: '12deg' }] }]}>🍕</Text>
            <Text style={[styles.food, { bottom: 56, left: 44, transform: [{ rotate: '8deg' }] }]}>🍗</Text>
            <Text style={[styles.food, { bottom: 48, right: 52, transform: [{ rotate: '-10deg' }] }]}>🥘</Text>
          </View>
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
          <Text variant="title" tone="inverse" style={{ marginTop: 14 }}>
            Cravely
          </Text>
          <Text tone="inverse" style={styles.tagline}>
            Your cravings, delivered.
          </Text>
        </View>

        <View style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <Text variant="title">{title}</Text>
          <Text tone="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
          {children}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.primary },
  hero: { alignItems: 'center', paddingBottom: 64, backgroundColor: t.colors.primary },
  decor: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  food: { position: 'absolute', fontSize: 34, lineHeight: 42, opacity: 0.9 },
  logo: { width: 76, height: 76, borderRadius: 22, borderWidth: 3, borderColor: 'rgba(255,255,255,0.35)' },
  tagline: { opacity: 0.9, marginTop: 2 },
  sheet: {
    flex: 1,
    marginTop: -32,
    backgroundColor: t.colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: t.spacing.xxl,
    paddingTop: t.spacing.xxxl,
  },
  subtitle: { marginTop: 4, marginBottom: t.spacing.xxl },
}));
