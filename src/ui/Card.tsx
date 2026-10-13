import React from 'react';
import { Pressable, StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { makeStyles } from '../theme';

interface CardProps extends ViewProps {
  onPress?: () => void;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function Card({ onPress, padded = true, style, children, accessibilityLabel, ...rest }: CardProps) {
  const styles = useStyles();
  const cardStyle = [styles.card, padded && styles.padded, style];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [cardStyle, pressed && styles.pressed]}
      >
        {children}
      </Pressable>
    );
  }
  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  card: {
    backgroundColor: t.colors.surface,
    borderRadius: t.radius.xl,
    ...t.shadow(1),
  },
  padded: { padding: t.spacing.lg },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
}));
