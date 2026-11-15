/**
 * Web fallback for AppMap: MapLibre's native module is not available in the browser build,
 * so we show a static OpenStreetMap tile preview with the same pins, and a link to open the
 * location in Google Maps. Picker mode degrades to the address form only.
 */
import React from 'react';
import { Linking, Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { DEFAULT_CENTER, LatLng } from '../../lib/geo';
import { makeStyles, useTheme } from '../../theme';
import { Text } from '../../ui';
import type { AppMapProps } from './AppMap';

export type { MapMarker, MapMarkerKind, AppMapProps } from './AppMap';

const TILE = 17;
function tileFor({ lat, lng }: LatLng, z = TILE) {
  const x = Math.floor(((lng + 180) / 360) * 2 ** z);
  const y = Math.floor(
    ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * 2 ** z
  );
  return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
}

export default function AppMap({ markers = [], center, value, style, rounded = true, picker }: AppMapProps) {
  const t = useTheme();
  const styles = useStyles();
  const focus: LatLng = center ?? value ?? markers[0] ?? DEFAULT_CENTER;
  const mapsUrl = `https://www.google.com/maps?q=${focus.lat},${focus.lng}`;

  return (
    <Pressable
      onPress={() => Linking.openURL(mapsUrl)}
      accessibilityRole="link"
      accessibilityLabel="Open location in Google Maps"
      style={[styles.wrap, rounded && styles.rounded, style]}
    >
      <Image source={{ uri: tileFor(focus) }} style={styles.tile} contentFit="cover" />
      <View style={styles.overlay}>
        <View style={styles.pin}>
          <Ionicons name={picker ? 'location' : markers[0]?.kind === 'home' ? 'home' : 'restaurant'} size={16} color="#FFF" />
        </View>
        <View style={styles.badge}>
          <Ionicons name="open-outline" size={14} color={t.colors.primary} />
          <Text variant="caption" tone="primary" style={{ fontFamily: t.fonts.bold }}>
            Open in Maps
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function MarkerPin() {
  return null;
}

const useStyles = makeStyles((t) => ({
  wrap: { height: 220, overflow: 'hidden', backgroundColor: t.colors.surfaceMuted },
  rounded: { borderRadius: t.radius.xl },
  tile: { width: '100%', height: '100%', opacity: 0.9 },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  pin: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: t.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFF',
  },
  badge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: t.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: t.radius.pill,
    ...t.shadow(1),
  },
}));
