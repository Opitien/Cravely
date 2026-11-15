import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { makeStyles } from '../theme';
import { Text } from './Text';
import { Button } from './Button';
import { LottieIcon } from './LottieIcon';
import { enter, useReduceMotion } from './motion';

// Full-area states so every screen handles loading / error / empty the same way.

export function LoadingState({ message, style }: { message?: string; style?: StyleProp<ViewStyle> }) {
  const styles = useStyles();
  return (
    <View style={[styles.container, style]}>
      <LottieIcon name="loader" size={72} />
      {message ? (
        <Text tone="secondary" center style={{ marginTop: 8 }}>
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
  const reduce = useReduceMotion();
  return (
    <View style={[styles.container, style]}>
      <MotiView
        from={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 10, stiffness: 180 }}
        style={styles.emojiCircle}
      >
        <Text style={styles.emoji}>{emoji}</Text>
      </MotiView>
      <MotiView {...enter(1, reduce)} style={{ alignItems: 'center' }}>
        <Text variant="title2" center>
          {title}
        </Text>
        {subtitle ? (
          <Text variant="subheadline" tone="secondary" center style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </MotiView>
      {actionLabel && onAction ? (
        <MotiView {...enter(2, reduce)} style={styles.action}>
          <Button title={actionLabel} onPress={onAction} />
        </MotiView>
      ) : null}
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
    backgroundColor: t.colors.groupedBackground,
  },
  emojiCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: t.colors.secondaryGroupedBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: t.spacing.xl,
    ...t.shadow(1),
  },
  emoji: { fontSize: 44, lineHeight: 52 },
  subtitle: { marginTop: t.spacing.sm, maxWidth: 300 },
  action: { marginTop: t.spacing.xxl, alignSelf: 'stretch', maxWidth: 320, width: '100%' },
}));
