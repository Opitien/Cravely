import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Address } from '../types';
import { makeStyles, useTheme } from '../theme';
import { Pill, Text } from '../ui';

interface AddressCardProps {
  address: Address;
  /** When defined, the card acts as a radio option. */
  isSelected?: boolean;
  onPress?: () => void;
  /** Optional trailing action, e.g. "Edit". */
  actionIcon?: React.ComponentProps<typeof Ionicons>['name'];
  onAction?: () => void;
}

const LABEL_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  home: 'home',
  work: 'briefcase',
  office: 'briefcase',
};

export default function AddressCard({ address, isSelected, onPress, actionIcon, onAction }: AddressCardProps) {
  const t = useTheme();
  const styles = useStyles();
  const selectable = isSelected !== undefined;
  const icon = LABEL_ICONS[address.label.trim().toLowerCase()] ?? 'location';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={selectable ? 'radio' : 'button'}
      accessibilityState={selectable ? { selected: !!isSelected } : undefined}
      style={({ pressed }) => [styles.card, isSelected && styles.selected, pressed && { opacity: 0.85 }]}
    >
      <View style={[styles.icon, isSelected && { backgroundColor: t.colors.primary }]}>
        <Ionicons name={icon} size={18} color={isSelected ? t.colors.textOnPrimary : t.colors.primary} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <View style={styles.labelRow}>
          <Text variant="bodyStrong">{address.label}</Text>
          {address.isDefault && <Pill label="Default" color={t.colors.success} background={t.colors.successSoft} />}
        </View>
        <Text tone="secondary" numberOfLines={2}>
          {address.line1}, {address.city}, {address.state}
        </Text>
        <Text variant="caption" tone="muted">
          {address.phone}
        </Text>
      </View>
      {onAction && actionIcon ? (
        <Pressable onPress={onAction} hitSlop={10} accessibilityLabel="Address options" style={styles.action}>
          <Ionicons name={actionIcon} size={20} color={t.colors.textSecondary} />
        </Pressable>
      ) : selectable ? (
        <Ionicons
          name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={isSelected ? t.colors.primary : t.colors.borderStrong}
        />
      ) : null}
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    padding: t.spacing.lg,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    borderWidth: 1.5,
    borderColor: t.colors.border,
    marginBottom: t.spacing.md,
  },
  selected: { borderColor: t.colors.primary, backgroundColor: t.colors.primarySoft },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: t.colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  action: { padding: 4 },
}));
