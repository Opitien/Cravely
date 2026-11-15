import React from 'react';
import { Platform, Pressable as RNPressable, StyleProp, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme } from '../theme';
import { Icon, IconName } from './Icon';
import { Pressable } from './Pressable';
import { Text } from './Text';

/** Page background (grouped) + top safe area for tab screens. */
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

/** iOS large title (34pt bold) at the top of tab screens, with optional subtitle and trailing control. */
export function LargeTitle({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  const styles = useStyles();
  return (
    <View style={styles.largeTitle}>
      <View style={{ flex: 1 }}>
        <Text variant="largeTitle">{title}</Text>
        {subtitle ? (
          <Text variant="subheadline" tone="secondary" style={{ marginTop: 2 }}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right}
    </View>
  );
}

/** Section heading (title3) with optional tinted action on the right. */
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
      <Text variant="title3">{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8} feedback="opacity" accessibilityRole="button">
          <Text variant="subheadlineStrong" tone="primary">
            {action}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/** Uppercase grouped-table section label (iOS "GROUP HEADER"). */
export function GroupLabel({ children, style }: { children: string; style?: StyleProp<ViewStyle> }) {
  const styles = useStyles();
  return (
    <Text variant="footnote" tone="secondary" style={[styles.groupLabel, style]}>
      {children.toUpperCase()}
    </Text>
  );
}

/** Inset grouped list container (10pt corners, secondary grouped background). Wrap ListRows in it. */
export function ListGroup({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const styles = useStyles();
  return <View style={[styles.group, style]}>{children}</View>;
}

/** Sticky bottom bar for primary actions — translucent blur like an iOS toolbar. */
export function BottomBar({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const padding = { paddingBottom: Math.max(insets.bottom, 16) };
  if (Platform.OS === 'web') {
    return <View style={[styles.bottomBar, styles.bottomBarSolid, padding]}>{children}</View>;
  }
  return (
    <BlurView intensity={80} tint={t.dark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'} style={[styles.bottomBar, padding]}>
      {children}
    </BlurView>
  );
}

/** Grouped-table row: 44pt min height, leading icon tile, trailing value + chevron, hairline separator. */
export function ListRow({
  icon,
  iconColor,
  title,
  subtitle,
  value,
  onPress,
  destructive,
  last,
}: {
  icon?: IconName;
  /** Background of the icon tile (iOS Settings style); defaults to tint. */
  iconColor?: string;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  last?: boolean;
}) {
  const t = useTheme();
  const styles = useStyles();
  const color = destructive ? t.colors.danger : t.colors.label;
  const tile = destructive ? t.colors.danger : iconColor ?? t.colors.primary;
  return (
    <RNPressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && !!onPress && { backgroundColor: t.colors.tertiaryFill }]}
    >
      {icon && (
        <View style={[styles.rowIcon, { backgroundColor: tile }]}>
          <Icon name={icon} size={17} color="#FFFFFF" weight="semibold" />
        </View>
      )}
      <View style={[styles.rowBody, !last && styles.rowDivider]}>
        <View style={{ flex: 1 }}>
          <Text variant="body" style={{ color }}>
            {title}
          </Text>
          {subtitle ? (
            <Text variant="footnote" tone="secondary" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        {value ? (
          <Text variant="body" tone="secondary" numberOfLines={1} style={{ maxWidth: 140 }}>
            {value}
          </Text>
        ) : null}
        {onPress && !destructive ? <Icon name="chevron-forward" size={14} color={t.colors.tertiaryLabel} weight="semibold" /> : null}
      </View>
    </RNPressable>
  );
}

export function Divider({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[{ height: t.hairline, backgroundColor: t.colors.separator }, style]} />;
}

/** Label / value line used in price summaries. */
export function SummaryRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  const styles = useStyles();
  return (
    <View style={styles.summaryRow}>
      <Text variant={strong ? 'headline' : 'subheadline'} tone={strong ? 'default' : 'secondary'} style={{ flex: 1 }}>
        {label}
      </Text>
      <Text variant={strong ? 'title3' : 'subheadlineStrong'} tone={strong ? 'primary' : 'default'}>
        {value}
      </Text>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.groupedBackground },
  largeTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.sm,
    paddingBottom: t.spacing.md,
    gap: t.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: t.spacing.lg,
    marginBottom: t.spacing.md,
  },
  groupLabel: { marginLeft: t.spacing.lg, marginBottom: 6 },
  group: {
    backgroundColor: t.colors.secondaryGroupedBackground,
    borderRadius: t.radius.md,
    overflow: 'hidden',
  },
  bottomBar: {
    paddingHorizontal: t.spacing.lg,
    paddingTop: t.spacing.md,
    borderTopWidth: t.hairline,
    borderTopColor: t.colors.separator,
  },
  bottomBarSolid: { backgroundColor: t.colors.secondaryGroupedBackground },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    paddingLeft: t.spacing.lg,
    minHeight: 44,
  },
  rowBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    paddingVertical: 11,
    paddingRight: t.spacing.lg,
  },
  rowDivider: { borderBottomWidth: t.hairline, borderBottomColor: t.colors.separator },
  rowIcon: {
    width: 29,
    height: 29,
    borderRadius: 7,
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
