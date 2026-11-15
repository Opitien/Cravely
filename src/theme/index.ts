/**
 * Cravely design system — Apple Human Interface Guidelines, tinted coral.
 *
 *  - Type: Apple text styles (largeTitle … caption2) on the platform system font (SF Pro / Roboto).
 *    Old variant names (display, title, heading, …) stay as aliases so existing screens compile.
 *  - Colour: iOS semantic roles (systemBackground, label, separator, …) in light and dark.
 *    Legacy token names (background, surface, text, …) are kept and point at the new roles.
 *  - Layout: 8pt grid, 16pt margins, 10pt grouped-list corners, hairline separators.
 *
 * Components get theme-aware styles with `makeStyles`:
 *   const useStyles = makeStyles((t) => ({ box: { backgroundColor: t.colors.surface } }));
 */
import { Platform, StyleSheet, TextStyle, useColorScheme, ViewStyle } from 'react-native';

const tint = {
  coral: '#FF5A5F',
  coralPressed: '#E8474C',
  coralDark: '#FF6B70',
  navy: '#131929',
};

// ─── Colour ─────────────────────────────────────────────────

const light = {
  // iOS semantic roles
  systemBackground: '#FFFFFF',
  secondarySystemBackground: '#F2F2F7',
  tertiarySystemBackground: '#FFFFFF',
  groupedBackground: '#F2F2F7',
  secondaryGroupedBackground: '#FFFFFF',
  tertiaryGroupedBackground: '#F2F2F7',
  label: '#000000',
  secondaryLabel: 'rgba(60, 60, 67, 0.60)',
  tertiaryLabel: 'rgba(60, 60, 67, 0.30)',
  quaternaryLabel: 'rgba(60, 60, 67, 0.18)',
  separator: 'rgba(60, 60, 67, 0.29)',
  opaqueSeparator: '#C6C6C8',
  fill: 'rgba(120, 120, 128, 0.20)',
  secondaryFill: 'rgba(120, 120, 128, 0.16)',
  tertiaryFill: 'rgba(118, 118, 128, 0.12)',
  systemBlue: '#007AFF',
  systemGreen: '#34C759',
  systemOrange: '#FF9500',
  systemRed: '#FF3B30',
  systemYellow: '#FFCC00',
  systemPurple: '#AF52DE',
  systemGray: '#8E8E93',

  // Brand tint + soft fills
  primary: tint.coral,
  primaryPressed: tint.coralPressed,
  primarySoft: 'rgba(255, 90, 95, 0.12)',

  // Legacy aliases (kept so existing screens compile)
  background: '#F2F2F7',
  surface: '#FFFFFF',
  surfaceMuted: 'rgba(118, 118, 128, 0.12)',
  surfaceSunken: '#E5E5EA',
  border: 'rgba(60, 60, 67, 0.29)',
  borderStrong: '#C6C6C8',
  text: '#000000',
  textSecondary: 'rgba(60, 60, 67, 0.60)',
  textMuted: 'rgba(60, 60, 67, 0.40)',
  textOnPrimary: '#FFFFFF',
  success: '#34C759',
  successSoft: 'rgba(52, 199, 89, 0.14)',
  warning: '#FF9500',
  warningSoft: 'rgba(255, 149, 0, 0.14)',
  danger: '#FF3B30',
  dangerSoft: 'rgba(255, 59, 48, 0.12)',
  info: '#007AFF',
  infoSoft: 'rgba(0, 122, 255, 0.12)',
  violet: '#AF52DE',
  violetSoft: 'rgba(175, 82, 222, 0.14)',
  star: '#FF9500',
  overlay: 'rgba(0, 0, 0, 0.4)',
  skeleton: '#E5E5EA',
  shadow: '#000000',
  brand: tint.navy,
  tabBar: 'rgba(249, 249, 249, 0.85)',
};

type ColorTokens = typeof light;

const dark: ColorTokens = {
  systemBackground: '#000000',
  secondarySystemBackground: '#1C1C1E',
  tertiarySystemBackground: '#2C2C2E',
  groupedBackground: '#000000',
  secondaryGroupedBackground: '#1C1C1E',
  tertiaryGroupedBackground: '#2C2C2E',
  label: '#FFFFFF',
  secondaryLabel: 'rgba(235, 235, 245, 0.60)',
  tertiaryLabel: 'rgba(235, 235, 245, 0.30)',
  quaternaryLabel: 'rgba(235, 235, 245, 0.16)',
  separator: 'rgba(84, 84, 88, 0.60)',
  opaqueSeparator: '#38383A',
  fill: 'rgba(120, 120, 128, 0.36)',
  secondaryFill: 'rgba(120, 120, 128, 0.32)',
  tertiaryFill: 'rgba(118, 118, 128, 0.24)',
  systemBlue: '#0A84FF',
  systemGreen: '#30D158',
  systemOrange: '#FF9F0A',
  systemRed: '#FF453A',
  systemYellow: '#FFD60A',
  systemPurple: '#BF5AF2',
  systemGray: '#8E8E93',

  primary: tint.coralDark,
  primaryPressed: tint.coral,
  primarySoft: 'rgba(255, 107, 112, 0.18)',

  background: '#000000',
  surface: '#1C1C1E',
  surfaceMuted: 'rgba(118, 118, 128, 0.24)',
  surfaceSunken: '#0A0A0A',
  border: 'rgba(84, 84, 88, 0.60)',
  borderStrong: '#38383A',
  text: '#FFFFFF',
  textSecondary: 'rgba(235, 235, 245, 0.60)',
  textMuted: 'rgba(235, 235, 245, 0.38)',
  textOnPrimary: '#FFFFFF',
  success: '#30D158',
  successSoft: 'rgba(48, 209, 88, 0.18)',
  warning: '#FF9F0A',
  warningSoft: 'rgba(255, 159, 10, 0.18)',
  danger: '#FF453A',
  dangerSoft: 'rgba(255, 69, 58, 0.18)',
  info: '#0A84FF',
  infoSoft: 'rgba(10, 132, 255, 0.18)',
  violet: '#BF5AF2',
  violetSoft: 'rgba(191, 90, 242, 0.18)',
  star: '#FF9F0A',
  overlay: 'rgba(0, 0, 0, 0.6)',
  skeleton: '#2C2C2E',
  shadow: '#000000',
  brand: tint.navy,
  tabBar: 'rgba(22, 22, 24, 0.80)',
};

// ─── Spacing & shape (8pt grid) ─────────────────────────────

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
/** iOS corner radii: 10 for grouped cells, 12–14 for cards, 20+ for sheets. */
export const radius = { sm: 8, md: 10, lg: 14, xl: 20, xxl: 28, pill: 999 } as const;
export const hairline = StyleSheet.hairlineWidth;

// ─── Typography ─────────────────────────────────────────────

/** System font families. `brand` is the loaded Plus Jakarta face, for the wordmark only. */
export const fonts = {
  system: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) as string,
  systemMedium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }) as string,
  brand: 'PlusJakartaSans_800ExtraBold',
  // Legacy keys — all map to the system font; use `t.weight.*` to also set the weight.
  regular: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) as string,
  medium: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }) as string,
  semibold: Platform.select({ ios: 'System', android: 'sans-serif-medium', default: 'System' }) as string,
  bold: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) as string,
  extrabold: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }) as string,
} as const;

/** Family + weight pairs: spread into a style, e.g. `{ ...t.weight.semibold }`. */
export const weight = {
  regular: { fontFamily: fonts.system, fontWeight: '400' },
  medium: { fontFamily: fonts.systemMedium, fontWeight: '500' },
  semibold: { fontFamily: fonts.systemMedium, fontWeight: '600' },
  bold: { fontFamily: fonts.system, fontWeight: '700' },
  heavy: { fontFamily: fonts.system, fontWeight: '800' },
  // legacy name
  extrabold: { fontFamily: fonts.system, fontWeight: '800' },
} satisfies Record<string, TextStyle>;

const apple = {
  largeTitle: { ...weight.bold, fontSize: 34, lineHeight: 41, letterSpacing: 0.37 },
  title1: { ...weight.bold, fontSize: 28, lineHeight: 34, letterSpacing: 0.36 },
  title2: { ...weight.bold, fontSize: 22, lineHeight: 28, letterSpacing: 0.35 },
  title3: { ...weight.semibold, fontSize: 20, lineHeight: 25, letterSpacing: 0.38 },
  headline: { ...weight.semibold, fontSize: 17, lineHeight: 22, letterSpacing: -0.41 },
  body: { ...weight.regular, fontSize: 17, lineHeight: 22, letterSpacing: -0.41 },
  callout: { ...weight.regular, fontSize: 16, lineHeight: 21, letterSpacing: -0.32 },
  subheadline: { ...weight.regular, fontSize: 15, lineHeight: 20, letterSpacing: -0.24 },
  footnote: { ...weight.regular, fontSize: 13, lineHeight: 18, letterSpacing: -0.08 },
  caption1: { ...weight.regular, fontSize: 12, lineHeight: 16 },
  caption2: { ...weight.regular, fontSize: 11, lineHeight: 13, letterSpacing: 0.07 },
} satisfies Record<string, TextStyle>;

export const type = {
  ...apple,
  // Emphasised variants used by cards and rows
  bodyStrong: { ...apple.body, ...weight.semibold },
  subheadlineStrong: { ...apple.subheadline, ...weight.semibold },
  footnoteStrong: { ...apple.footnote, ...weight.semibold },
  caption1Strong: { ...apple.caption1, ...weight.semibold },
  // Legacy aliases → Apple styles
  display: apple.largeTitle,
  title: apple.title1,
  heading: apple.title3,
  subheading: apple.headline,
  label: { ...apple.footnote, ...weight.semibold },
  caption: apple.caption1,
  overline: { ...apple.footnote, ...weight.regular, textTransform: 'uppercase', letterSpacing: 0.4 },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

// ─── Motion presets ─────────────────────────────────────────

/** Spring configs tuned to feel like UIKit's interactive springs. */
export const springs = {
  /** Snappy tap feedback */
  press: { damping: 18, stiffness: 320, mass: 0.6 },
  /** Content entering */
  enter: { damping: 20, stiffness: 180, mass: 0.8 },
  /** Playful icon pop */
  pop: { damping: 9, stiffness: 260, mass: 0.6 },
} as const;

// ─── Theme ──────────────────────────────────────────────────

export interface Theme {
  dark: boolean;
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  hairline: number;
  type: typeof type;
  fonts: typeof fonts;
  weight: typeof weight;
  springs: typeof springs;
  /** Soft iOS-style elevation (light) or hairline edge (dark). */
  shadow: (level: 1 | 2 | 3) => ViewStyle;
}

function buildTheme(isDark: boolean): Theme {
  const colors = isDark ? dark : light;
  return {
    dark: isDark,
    colors,
    spacing,
    radius,
    hairline,
    type,
    fonts,
    weight,
    springs,
    shadow: (level) =>
      isDark
        ? { borderWidth: hairline, borderColor: colors.separator }
        : {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: level * 2 },
            shadowOpacity: 0.04 + level * 0.02,
            shadowRadius: level * 5,
            elevation: level,
          },
  };
}

const themes = { light: buildTheme(false), dark: buildTheme(true) };

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? themes.dark : themes.light;
}

/** Create a hook returning StyleSheet styles built from the active theme (cached per scheme). */
export function makeStyles<T extends StyleSheet.NamedStyles<T>>(factory: (theme: Theme) => T) {
  const cache: Partial<Record<'light' | 'dark', T>> = {};
  return function useStyles(): T {
    const theme = useTheme();
    const key = theme.dark ? 'dark' : 'light';
    return (cache[key] ??= StyleSheet.create(factory(theme)));
  };
}
