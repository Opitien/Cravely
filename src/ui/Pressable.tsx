/**
 * Pressable with UIKit-style feedback: a quick spring scale (0.97) and optional highlight.
 * Drop-in for react-native's Pressable; `feedback="opacity"` mimics iOS bar-button dimming.
 */
import React, { useCallback } from 'react';
import { Pressable as RNPressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { springs } from '../theme';
import { useReduceMotion } from './motion';

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);

export interface ScalePressableProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** scale: card/button press (default) · opacity: text/bar buttons · none */
  feedback?: 'scale' | 'opacity' | 'both' | 'none';
  /** How far to shrink, 0.97 by default (0.9 for small round buttons). */
  pressScale?: number;
}

export function Pressable({ style, feedback = 'scale', pressScale = 0.97, onPressIn, onPressOut, disabled, ...rest }: ScalePressableProps) {
  const reduce = useReduceMotion();
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = feedback === 'scale' || feedback === 'both' ? 1 - (1 - pressScale) * pressed.value : 1;
    const opacity = feedback === 'opacity' || feedback === 'both' ? 1 - 0.45 * pressed.value : 1;
    return { transform: [{ scale }], opacity };
  });

  const handleIn = useCallback(
    (e: any) => {
      pressed.value = reduce ? withTiming(1, { duration: 80 }) : withSpring(1, springs.press);
      onPressIn?.(e);
    },
    [onPressIn, pressed, reduce]
  );
  const handleOut = useCallback(
    (e: any) => {
      pressed.value = reduce ? withTiming(0, { duration: 120 }) : withSpring(0, springs.press);
      onPressOut?.(e);
    },
    [onPressOut, pressed, reduce]
  );

  return (
    <AnimatedPressable
      {...rest}
      disabled={disabled}
      onPressIn={feedback === 'none' ? onPressIn : handleIn}
      onPressOut={feedback === 'none' ? onPressOut : handleOut}
      style={[style, feedback !== 'none' && animatedStyle]}
    />
  );
}
