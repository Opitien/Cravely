import React from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import { makeStyles, useTheme } from '../theme';
import { Text } from './Text';
import { Button } from './Button';

// Full-area states so every screen handles loading / error / empty the same way.

export function LoadingState({ message, style }: { message?: string; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  const styles = useStyles();
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={t.colors.primary} />
      {message ? (
        <Text tone="secondary" center style={{ marginTop: 16 }}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

export function EmptyState({
  emoji,
  title,
  subtitle,
  actionLabel,
  onAction,
  style,
}: {
  emoji: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = useStyles();
  return (
    <View style={[styles.container, style]}>
      <View style={styles.emojiCircle}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text variant="heading" center>
        {title}
      </Text>
      {subtitle ? (
        <Text tone="secondary" center style={styles.subtitle}>
          {subtitle}
        </Text>
      ) : null}
      {actionLabel && onAction ? <Button title={actionLabel} onPress={onAction} style={styles.action} /> : null}
    </View>
  );
}

export function ErrorState({
  message = 'Something went wrong.',
  onRetry,
  style,
}: {
  message?: string;
  onRetry?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <EmptyState
      emoji="😕"
      title="Couldn't load this"
      subtitle={message}
      actionLabel={onRetry ? 'Try again' : undefined}
      onAction={onRetry}
      style={style}
    />
  );
}

const useStyles = makeStyles((t) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: t.spacing.xxxl,
    paddingVertical: 48,
    backgroundColor: t.colors.background,
  },
  emojiCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: t.colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: t.spacing.xl,
  },
  emoji: { fontSize: 44, lineHeight: 52 },
  subtitle: { marginTop: t.spacing.sm, maxWidth: 300 },
  action: { marginTop: t.spacing.xxl, alignSelf: 'stretch', maxWidth: 320, width: '100%' },
}));
