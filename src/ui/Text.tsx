import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { TypeVariant, useTheme } from '../theme';

/** Semantic text colours (iOS label roles + brand/status). */
type Tone =
  | 'default'
  | 'secondary'
  | 'tertiary'
  | 'muted'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'inverse';

export interface AppTextProps extends TextProps {
  variant?: TypeVariant;
  tone?: Tone;
  center?: boolean;
}

export function Text({ variant = 'body', tone = 'default', center, style, ...rest }: AppTextProps) {
  const t = useTheme();
  const color = {
    default: t.colors.label,
    secondary: t.colors.secondaryLabel,
    tertiary: t.colors.tertiaryLabel,
    muted: t.colors.textMuted,
    primary: t.colors.primary,
    success: t.colors.success,
    warning: t.colors.warning,
    danger: t.colors.danger,
    info: t.colors.info,
    inverse: t.colors.textOnPrimary,
  }[tone];
  return (
    <RNText
      maxFontSizeMultiplier={1.35}
      style={[t.type[variant], { color }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
