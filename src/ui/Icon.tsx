/**
 * Icon — SF Symbols on iOS (expo-symbols), Ionicons everywhere else.
 * Takes an Ionicons name so existing call sites keep working; known names map to SF Symbols.
 *
 *   <Icon name="heart" size={22} color={t.colors.primary} animation="bounce" />
 */
import React from 'react';
import { Platform, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SymbolView, type SFSymbol } from 'expo-symbols';

export type IconName = React.ComponentProps<typeof Ionicons>['name'];
export type IconAnimation = 'bounce' | 'pulse' | 'scale' | 'none';

const SF: Partial<Record<string, SFSymbol>> = {
  home: 'house.fill',
  'home-outline': 'house',
  receipt: 'receipt.fill',
  'receipt-outline': 'receipt',
  'bag-handle': 'bag.fill',
  'bag-handle-outline': 'bag',
  bag: 'bag.fill',
  'bag-outline': 'bag',
  heart: 'heart.fill',
  'heart-outline': 'heart',
  location: 'location.fill',
  'location-outline': 'location',
  search: 'magnifyingglass',
  add: 'plus',
  'add-circle': 'plus.circle.fill',
  close: 'xmark',
  'close-circle': 'xmark.circle.fill',
  'chevron-forward': 'chevron.right',
  'chevron-down': 'chevron.down',
  'chevron-back': 'chevron.left',
  'arrow-back': 'chevron.left',
  time: 'clock.fill',
  'time-outline': 'clock',
  star: 'star.fill',
  bicycle: 'bicycle',
  'bicycle-outline': 'bicycle',
  flame: 'flame.fill',
  'flame-outline': 'flame',
  checkmark: 'checkmark',
  'checkmark-circle': 'checkmark.circle.fill',
  'checkmark-circle-outline': 'checkmark.circle',
  'ellipse-outline': 'circle',
  ellipse: 'circle.fill',
  card: 'creditcard.fill',
  'card-outline': 'creditcard',
  cash: 'banknote.fill',
  'cash-outline': 'banknote',
  call: 'phone.fill',
  'call-outline': 'phone',
  person: 'person.crop.circle.fill',
  'person-outline': 'person.crop.circle',
  trash: 'trash.fill',
  'trash-outline': 'trash',
  locate: 'location.fill',
  navigate: 'location.north.fill',
  restaurant: 'fork.knife',
  moon: 'moon.fill',
  'lock-closed': 'lock.fill',
  'lock-closed-outline': 'lock',
  refresh: 'arrow.clockwise',
  repeat: 'arrow.triangle.2.circlepath',
  'eye-outline': 'eye',
  'eye-off-outline': 'eye.slash',
  'information-circle': 'info.circle.fill',
  'chatbubble-ellipses': 'bubble.left.fill',
  briefcase: 'briefcase.fill',
  'log-out-outline': 'rectangle.portrait.and.arrow.right',
  mail: 'envelope.fill',
  'mail-outline': 'envelope',
  key: 'key.fill',
  'key-outline': 'key',
  'ellipsis-horizontal': 'ellipsis',
  'open-outline': 'arrow.up.right.square',
  remove: 'minus',
  move: 'arrow.up.and.down.and.arrow.left.and.right',
  'create-outline': 'pencil',
  'help-circle-outline': 'questionmark.circle',
  'shield-checkmark-outline': 'checkmark.shield',
  'document-text-outline': 'doc.text',
  'person-circle-outline': 'person.crop.circle',
  'arrow-forward': 'arrow.right',
  'close-circle-outline': 'xmark.circle',
  'cart-outline': 'cart',
  'notifications-outline': 'bell',
  notifications: 'bell.fill',
};

interface IconProps {
  name: IconName;
  size?: number;
  color: string;
  /** SF Symbol effect on iOS (bounce / pulse / scale). Android gets no built-in effect here. */
  animation?: IconAnimation;
  /** Re-trigger the effect whenever this value changes (e.g. favourite count). */
  animationKey?: string | number | boolean;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  style?: StyleProp<ViewStyle>;
}

export function Icon({ name, size = 22, color, animation = 'none', animationKey, weight = 'medium', style }: IconProps) {
  const sf = SF[name];
  if (Platform.OS === 'ios' && sf) {
    return (
      <SymbolView
        key={animationKey === undefined ? undefined : String(animationKey)}
        name={sf}
        size={size}
        tintColor={color}
        weight={weight}
        resizeMode="scaleAspectFit"
        animationSpec={animation === 'none' ? undefined : { effect: { type: animation, wholeSymbol: true }, repeating: false }}
        fallback={<Ionicons name={name} size={size} color={color} />}
        style={[{ width: size, height: size }, style]}
      />
    );
  }
  return <Ionicons name={name} size={size} color={color} style={style as any} />;
}
