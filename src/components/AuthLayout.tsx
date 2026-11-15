import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MotiView } from 'moti';
import { makeStyles, useTheme } from '../theme';
import { Text, enter, useReduceMotion } from '../ui';

const FOOD = [
  { emoji: '🍔', top: 8, left: 24, rotate: '-14deg', delay: 0 },
  { emoji: '🍕', top: 40, right: 28, rotate: '12deg', delay: 120 },
  { emoji: '🍗', bottom: 56, left: 44, rotate: '8deg', delay: 240 },
  { emoji: '🥘', bottom: 48, right: 52, rotate: '-10deg', delay: 360 },
] as const;

/** Coral brand header with the form on a rounded sheet below. Shared by login/sign-up. */
export default function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  const t = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const reduce = useReduceMotion();

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[styles.hero, { paddingTop: insets.top + 24 }]}>
          {/* Decorative food emoji drifting in, hidden from screen readers */}
          <View style={styles.decor} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
            {FOOD.map((f) => (
              <MotiView
                key={f.emoji}
                from={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.4, translateY: 20 }}
                animate={{ opacity: 0.9, scale: 1, translateY: 0 }}
                transition={{ type: 'spring', damping: 9, stiffness: 160, delay: f.delay }}
                style={[
                  styles.food,
                  'top' in f ? { top: insets.top + f.top } : { bottom: f.bottom },
                  'left' in f ? { left: f.left } : { right: f.right },
                ]}
              >
                <Text style={[styles.foodText, { transform: [{ rotate: f.rotate }] }]}>{f.emoji}</Text>
              </MotiView>
            ))}
          </View>
          <MotiView from={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', damping: 12, stiffness: 180 }}>
            <Image source={require('../../assets/icon.png')} style={styles.logo} />
          </MotiView>
          <Text style={styles.wordmark}>Cravely</Text>
          <Text variant="subheadline" tone="inverse" style={styles.tagline}>
            Your cravings, delivered.
          </Text>
        </View>

        <MotiView {...enter(2, reduce)} style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}>
          <Text variant="title1">{title}</Text>
          <Text variant="subheadline" tone="secondary" style={styles.subtitle}>
            {subtitle}
          </Text>
          {children}
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((t) => ({
  root: { flex: 1, backgroundColor: t.colors.primary },
  hero: { alignItems: 'center', paddingBottom: 64, backgroundColor: t.colors.primary },
  decor: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  food: { position: 'absolute' },
  foodText: { fontSize: 34, lineHeight: 42 },
  logo: { width: 76, height: 76, borderRadius: 22, borderWidth: 3, borderColor: 'rgba(255,255,255,0.35)' },
  wordmark: { fontFamily: t.fonts.brand, fontSize: 28, lineHeight: 34, color: '#FFFFFF', marginTop: 14, letterSpacing: -0.4 },
  tagline: { opacity: 0.9, marginTop: 2 },
  sheet: {
    flex: 1,
    marginTop: -32,
    backgroundColor: t.colors.groupedBackground,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: t.spacing.xxl,
    paddingTop: t.spacing.xxxl,
  },
  subtitle: { marginTop: 4, marginBottom: t.spacing.xxl },
}));
