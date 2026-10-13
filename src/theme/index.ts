/**
 * Cravely design system: colour tokens (light + dark), spacing, radii, type scale.
 *
 * Components get theme-aware styles with `makeStyles`:
 *   const useStyles = makeStyles((t) => ({ box: { backgroundColor: t.colors.surface } }));
 *   const styles = useStyles();
 */
import { StyleSheet, TextStyle, useColorScheme, ViewStyle } from 'react-native';

const palette = {
  coral: '#FF5A5F',
  coralDeep: '#E8474C',
  navy: '#131929',
};

const light = {
  background: '#FFF8F4', // warm white page
  surface: '#FFFFFF', // cards, sheets
  surfaceMuted: '#FFF0E8', // inputs, chips, quiet fills
  surfaceSunken: '#FBE9DF',
  border: '#F2E3DA',
  borderStrong: '#E6D2C6',

  text: '#1F1512',
  textSecondary: '#6B5A53',
  textMuted: '#A08F87',
  textOnPrimary: '#FFFFFF',

  primary: palette.coral,
  primaryPressed: palette.coralDeep,
  primarySoft: '#FFE6E3',

  success: '#16A34A',
  successSoft: '#DCFCE7',
  warning: '#D97706',
  warningSoft: '#FEF3C7',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  info: '#2563EB',
  infoSoft: '#DBEAFE',
  violet: '#7C3AED',
  violetSoft: '#EDE9FE',

  star: '#F5A524',
  overlay: 'rgba(31, 21, 18, 0.5)',
  skeleton: '#F3E4DB',
  shadow: '#5A2D1E',
  brand: palette.navy,
  tabBar: '#FFFFFF',
};

type ColorTokens = typeof light;

const dark: ColorTokens = {
  background: '#130F0D',
  surface: '#1E1816',
  surfaceMuted: '#2A221F',
  surfaceSunken: '#0E0B0A',
  border: '#2E2522',
  borderStrong: '#3F332E',

  text: '#FBF4F0',
  textSecondary: '#CDBDB5',
  textMuted: '#8F7F78',
  textOnPrimary: '#FFFFFF',

  primary: '#FF676B',
  primaryPressed: palette.coral,
  primarySoft: '#3B2020',

  success: '#22C55E',
  successSoft: '#12301E',
  warning: '#F59E0B',
  warningSoft: '#33260C',
  danger: '#F87171',
  dangerSoft: '#3A1818',
  info: '#60A5FA',
  infoSoft: '#132640',
  violet: '#A78BFA',
  violetSoft: '#271E40',

  star: '#FBBF24',
  overlay: 'rgba(0, 0, 0, 0.6)',
  skeleton: '#2A221F',
  shadow: '#000000',
  brand: palette.navy,
  tabBar: '#1A1513',
};

export const spacing = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, pill: 999 } as const;

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;

export const type = {
  display: { fontFamily: fonts.extrabold, fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
  title: { fontFamily: fonts.extrabold, fontSize: 24, lineHeight: 30, letterSpacing: -0.4 },
  heading: { fontFamily: fonts.bold, fontSize: 18, lineHeight: 24, letterSpacing: -0.2 },
  subheading: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22 },
  body: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 21 },
  bodyStrong: { fontFamily: fonts.bold, fontSize: 15, lineHeight: 21 },
  label: { fontFamily: fonts.semibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: fonts.bold, fontSize: 11, lineHeight: 14, letterSpacing: 0.8, textTransform: 'uppercase' },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof type;

export interface Theme {
  dark: boolean;
  colors: ColorTokens;
  spacing: typeof spacing;
  radius: typeof radius;
  type: typeof type;
  fonts: typeof fonts;
  shadow: (level: 1 | 2 | 3) => ViewStyle;
}

function buildTheme(isDark: boolean): Theme {
  const colors = isDark ? dark : light;
  return {
    dark: isDark,
    colors,
    spacing,
    radius,
    type,
    fonts,
    shadow: (level) =>
      isDark
        ? { borderWidth: StyleSheet.hairlineWidth, borderColor: colors.border }
        : {
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: level * 3 },
            shadowOpacity: 0.05 + level * 0.025,
            shadowRadius: level * 6,
            elevation: level * 2,
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
