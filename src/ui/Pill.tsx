import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { makeStyles, useTheme } from '../theme';
import { Text } from './Text';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Small coloured label, e.g. order status or "Free delivery". */
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
  const fg = color ?? t.colors.textSecondary;
  return (
    <View style={[styles.pill, { backgroundColor: background ?? t.colors.surfaceMuted }, style]}>
      {icon && <Ionicons name={icon} size={13} color={fg} />}
      <Text variant="caption" style={{ color: fg, fontFamily: t.fonts.bold }} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Selectable chip (filters, categories). */
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
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && { opacity: 0.8 }]}
    >
      {leading ? <Text style={{ fontSize: 16 }}>{leading}</Text> : null}
      <Text variant="label" style={{ color: selected ? t.colors.textOnPrimary : t.colors.text }}>
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
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: t.radius.pill,
    alignSelf: 'flex-start',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 40,
    borderRadius: t.radius.pill,
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.colors.border,
  },
  chipSelected: {
    backgroundColor: t.colors.primary,
    borderColor: t.colors.primary,
  },
}));
