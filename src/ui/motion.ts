/**
 * Motion helpers shared by the UI kit.
 *
 * - useReduceMotion(): mirrors the OS "Reduce Motion" switch; springs become quick fades.
 * - enter(index): Moti props for the standard "fade + rise" entrance with a short stagger.
 */
import { ComponentProps, useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';
import type { MotiView } from 'moti';

type MotiViewProps = ComponentProps<typeof MotiView>;

let cached: boolean | null = null;

export function useReduceMotion() {
  const [reduce, setReduce] = useState(cached ?? false);
  useEffect(() => {
    if (Platform.OS === 'web') return;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => {
        cached = v;
        setReduce(v);
      })
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', (v) => {
      cached = v;
      setReduce(v);
    });
    return () => sub.remove();
  }, []);
  return reduce;
}

/** Standard entrance for cards/list rows. `index` adds a 40 ms stagger per item (capped). */
export function enter(index = 0, reduce = false): Pick<MotiViewProps, 'from' | 'animate' | 'transition'> {
  if (reduce) {
    return { from: { opacity: 0 }, animate: { opacity: 1 }, transition: { type: 'timing', duration: 150 } };
  }
  return {
    from: { opacity: 0, translateY: 14, scale: 0.98 },
    animate: { opacity: 1, translateY: 0, scale: 1 },
    transition: { type: 'spring', damping: 20, stiffness: 180, mass: 0.8, delay: Math.min(index, 10) * 40 },
  };
}

/** Exit used with AnimatePresence. */
export const exit = { opacity: 0, translateY: 10, scale: 0.98 } as const;
