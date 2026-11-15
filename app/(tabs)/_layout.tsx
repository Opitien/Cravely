import React, { useEffect } from 'react';
import { ColorValue, Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring, withTiming } from 'react-native-reanimated';
import { useCart } from '../../src/context/CartContext';
import { useTheme } from '../../src/theme';
import { Icon, IconName, useReduceMotion } from '../../src/ui';

/** Tab icon that pops when it becomes selected (SF Symbol bounce on iOS, spring scale elsewhere). */
function TabIcon({ active, inactive, color, focused }: { active: IconName; inactive: IconName; color: ColorValue; focused: boolean }) {
  const reduce = useReduceMotion();
  const scale = useSharedValue(1);
  useEffect(() => {
    if (!focused || reduce) return;
    scale.value = withSequence(withTiming(0.85, { duration: 70 }), withSpring(1, { damping: 9, stiffness: 260 }));
  }, [focused, reduce, scale]);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <Animated.View style={style}>
      <Icon name={focused ? active : inactive} size={26} color={String(color)} animation={focused ? 'bounce' : 'none'} animationKey={focused} />
    </Animated.View>
  );
}

const tabIcon =
  (active: IconName, inactive: IconName) =>
  ({ color, focused }: { color: ColorValue; focused: boolean }) => <TabIcon active={active} inactive={inactive} color={color} focused={focused} />;

export default function TabLayout() {
  const t = useTheme();
  const { totalItems } = useCart();
  const translucent = Platform.OS !== 'web';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: t.colors.primary,
        tabBarInactiveTintColor: t.colors.systemGray,
        tabBarStyle: {
          backgroundColor: translucent ? 'transparent' : t.colors.tabBar,
          borderTopWidth: t.hairline,
          borderTopColor: t.colors.separator,
          elevation: 0,
        },
        tabBarBackground: translucent
          ? () => (
              <BlurView
                intensity={90}
                tint={t.dark ? 'systemChromeMaterialDark' : 'systemChromeMaterialLight'}
                style={StyleSheet.absoluteFill}
              />
            )
          : undefined,
        tabBarLabelStyle: { ...t.type.caption2, ...t.weight.medium },
        tabBarBadgeStyle: { backgroundColor: t.colors.primary, ...t.type.caption2, ...t.weight.semibold, color: '#FFF' },
        sceneStyle: { backgroundColor: t.colors.groupedBackground },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders', tabBarIcon: tabIcon('receipt', 'receipt-outline') }} />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarBadge: totalItems > 0 ? totalItems : undefined,
          tabBarIcon: tabIcon('bag-handle', 'bag-handle-outline'),
        }}
      />
      <Tabs.Screen name="favorites" options={{ title: 'Saved', tabBarIcon: tabIcon('heart', 'heart-outline') }} />
    </Tabs>
  );
}
