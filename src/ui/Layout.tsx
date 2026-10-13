import React from 'react';
import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '../theme';
import { Text } from './Text';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Page background + top safe area for tab screens. */
export function Screen({
  children,
  edges = ['top'],
  style,
}: {
  children: React.ReactNode;
  edges?: ('top' | 'bottom')[];
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
}

/** Big bold page title used at the top of tab screens. */
export function LargeTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  const styles = useStyles();
  return (
    <View style={styles.largeTitle}>
      <View style={{ flex: 1 }}>
        <Text variant="title">{title}</Text>
        {subtitle ? (
          <Text tone="secondary" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** Section heading with optional action on the right. */
export function SectionHeader({
  title,
  action,
  onAction,
  style,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  return (
    <View style={[styles.sectionHeader, style]}>
      <Text variant="heading">{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="label" tone="primary">
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Sticky bottom bar for primary actions (checkout, pay…). */
export function BottomBar({ children }: { children: React.ReactNode }) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  return <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>{children}</View>;
}

/** Settings-style row. */
export function ListRow({
  icon,
  title,
  subtitle,
  value,
  onPress,
  destructive,
  last,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  last?: boolean;
}) {
  const t = useTheme();
  const styles = useStyles();
  const color = destructive ? t.colors.danger : t.colors.text;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, !last && styles.rowDivider, pressed && { backgroundColor: t.colors.surfaceMuted }]}
    >
      {icon && (
        <View style={[styles.rowIcon, destructive && { backgroundColor: t.colors.dangerSoft }]}>
          <Ionicons name={icon} size={19} color={destructive ? t.colors.danger : t.colors.textSecondary} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <Text variant="bodyStrong" style={{ color }}>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="label" tone="muted" numberOfLines={1} style={{ maxWidth: 140 }}>
          {value}
        </Text>
      ) : null}
      {onPress && !destructive ? <Ionicons name="chevron-forward" size={18} color={t.colors.textMuted} /> : null}
    </Pressable>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[{ height: 1, backgroundColor: t.colors.border }, style]} />;
}

/** Label / value line used in price summaries. */
export function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  const styles = useStyles();
  return (
    <View style={styles.summaryRow}>
      <Text variant={strong ? 'subheading' : 'body'} tone={strong ? 'default' : 'secondary'} style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant={strong ? 'heading' : 'bodyStrong'} tone={strong ? 'primary' : 'default'}>
        {value}
      </Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  largeTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.spacing.xl,
    paddingTop: t.spacing.md,
    paddingBottom: t.spacing.lg,
    gap: t.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: t.spacing.xl,
    marginBottom: t.spacing.md,
  },
  bottomBar: {
    paddingHorizontal: t.spacing.xl,
    paddingTop: t.spacing.md,
    backgroundColor: t.colors.surface,
    borderTopWidth: 1,
    borderTopColor: t.colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    paddingHorizontal: t.spacing.lg,
    paddingVertical: 14,
  },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: t.colors.border },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: t.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    marginBottom: t.spacing.sm + 2,
  },
}));
