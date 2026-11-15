import React from 'react';
import { Pressable as RNPressable, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { Address } from '../types';
import { makeStyles, useTheme } from '../theme';
import { Icon, IconName, Pill, Pressable, Text } from '../ui';

interface AddressCardProps {
  address: Address;
  /** When defined, the card acts as a radio option. */
  isSelected?: boolean;
  onPress?: () => void;
  /** Optional trailing action, e.g. "Edit". */
  actionIcon?: IconName;
  onAction?: () => void;
}

const LABEL_ICONS: Record<string, IconName> = {
  home: 'home',
  work: 'briefcase',
  office: 'briefcase',
};

export default function AddressCard({ address, isSelected, onPress, actionIcon, onAction }: AddressCardProps) {
  const t = useTheme();
  const styles = useStyles();
  const selectable = isSelected !== undefined;
  const icon = LABEL_ICONS[address.label.trim().toLowerCase()] ?? 'location';
  const pinned = typeof address.lat === 'number' && typeof address.lng === 'number';

  return (
    <Pressable
      onPress={() => {
        if (selectable) Haptics.selectionAsync().catch(() => undefined);
        onPress?.();
      }}
      disabled={!onPress}
      pressScale={0.985}
      accessibilityRole={selectable ? 'radio' : 'button'}
      accessibilityState={selectable ? { selected: !!isSelected } : undefined}
    >
      <MotiView
        animate={{
          borderColor: isSelected ? t.colors.primary : 'rgba(0,0,0,0)',
          backgroundColor: isSelected ? t.colors.primarySoft : t.colors.secondaryGroupedBackground,
        }}
        transition={{ type: 'timing', duration: 160 }}
        style={styles.card}
      >
        <MotiView animate={{ backgroundColor: isSelected ? t.colors.primary : t.colors.primarySoft }} transition={{ type: 'timing', duration: 160 }} style={styles.icon}>
          <Icon name={icon} size={17} color={isSelected ? t.colors.textOnPrimary : t.colors.primary} weight="semibold" />
        </MotiView>
        <View style={{ flex: 1, gap: 2 }}>
          <View style={styles.labelRow}>
            <Text variant="headline">{address.label}</Text>
            {address.isDefault && <Pill label="Default" color={t.colors.success} background={t.colors.successSoft} />}
            {pinned && <Icon name="location" size={12} color={t.colors.tertiaryLabel} />}
          </View>
          <Text variant="subheadline" tone="secondary" numberOfLines={2}>
            {address.line1}, {address.city}, {address.state}
          </Text>
          <Text variant="footnote" tone="tertiary">
            {address.phone}
          </Text>
        </View>
        {onAction && actionIcon ? (
          <RNPressable onPress={onAction} hitSlop={10} accessibilityLabel="Address options" accessibilityRole="button" style={styles.action}>
            <Icon name={actionIcon} size={20} color={t.colors.secondaryLabel} />
          </RNPressable>
        ) : selectable ? (
          <Icon
            name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={isSelected ? t.colors.primary : t.colors.tertiaryLabel}
            animation="bounce"
            animationKey={isSelected}
          />
        ) : null}
      </MotiView>
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
    borderWidth: 1.5,
    marginBottom: t.spacing.md,
    ...t.shadow(1),
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm },
  action: { padding: 4 },
}));
