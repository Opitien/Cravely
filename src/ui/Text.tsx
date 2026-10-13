import React from 'react';
import { Text as RNText, TextProps } from 'react-native';
import { TypeVariant, useTheme } from '../theme';

type Tone = 'default' | 'secondary' | 'muted' | 'primary' | 'success' | 'danger' | 'inverse';

export interface AppTextProps extends TextProps {
  variant?: TypeVariant;
  tone?: Tone;
  center?: boolean;
}

export function Text({ variant = 'body', tone = 'default', center, style, ...rest }: AppTextProps) {
  const t = useTheme();
  const color = {
    default: t.colors.text,
    secondary: t.colors.textSecondary,
    muted: t.colors.textMuted,
    primary: t.colors.primary,
    success: t.colors.success,
    danger: t.colors.danger,
    inverse: t.colors.textOnPrimary,
  }[tone];
  return (
    <RNText
      maxFontSizeMultiplier={1.4}
      style={[t.type[variant], { color }, center && { textAlign: 'center' }, style]}
      {...rest}
    />
  );
}
