import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { makeStyles, useTheme } from '../theme';
import { Icon, IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** Small tinted label, e.g. order status or "Free delivery". */
export function Pill({
  label,
  icon,
  color,
  background,
  style,
}: {
  label: string;
  icon?: IconName;
  color?: string;
  background?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTheme();
  const styles = useStyles();
  const fg = color ?? t.colors.secondaryLabel;
  return (
    <View style={[styles.pill, { backgroundColor: background ?? t.colors.tertiaryFill }, style]}>
      {icon && <Icon name={icon} size={12} color={fg} weight="bold" />}
      <Text variant="caption1Strong" style={{ color: fg }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Selectable chip (filters, categories) — iOS segmented feel: tinted when selected. */
export function Chip({
  label,
  leading,
  selected,
  onPress,
}: {
  label: string;
  leading?: string;
  selected?: boolean;
  onPress?: () => void;
}) {
  const t = useTheme();
  const styles = useStyles();
  return (
    <Pressable
      onPress={() => {
        Haptics.selectionAsync().catch(() => undefined);
        onPress?.();
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      pressScale={0.95}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      {leading ? <Text style={{ fontSize: 16 }}>{leading}</Text> : null}
      <Text variant="subheadlineStrong" style={{ color: selected ? t.colors.textOnPrimary : t.colors.label }}>
        {label}
      </Text>
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: t.radius.pill,
    alignSelf: 'flex-start',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 36,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.tertiaryFill,
  },
  chipSelected: { backgroundColor: t.colors.primary },
}));
