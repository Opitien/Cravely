import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { MotiView } from 'moti';
import { makeStyles } from '../theme';
import { Pressable } from './Pressable';
import { enter, useReduceMotion } from './motion';

interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  /** Animate in with the standard fade + rise; `index` staggers lists. */
  animated?: boolean;
  index?: number;
}

/** Grouped-background card: secondarySystemGroupedBackground, 14pt corners, soft elevation. */
export function Card({ onPress, padded = true, style, children, accessibilityLabel, animated, index = 0, ...rest }: CardProps) {
  const styles = useStyles();
  const reduce = useReduceMotion();
  const cardStyle = [styles.card, padded && styles.padded, style];

  const body = onPress ? (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={accessibilityLabel} pressScale={0.985} style={cardStyle}>
      {children}
    </Pressable>
  ) : (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );

  if (!animated) return body;
  return <MotiView {...enter(index, reduce)}>{body}</MotiView>;
}

const useStyles = makeStyles((t) => ({
  card: {
    backgroundColor: t.colors.secondaryGroupedBackground,
    borderRadius: t.radius.lg,
    ...t.shadow(1),
  },
  padded: { padding: t.spacing.lg },
}));
