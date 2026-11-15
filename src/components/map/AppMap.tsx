/**
 * AppMap — the one map component the app uses (MapLibre + OpenFreeMap tiles, no API key).
 * Web gets a static fallback from AppMap.web.tsx.
 *
 *   <AppMap markers={[{ id: 'r', lat, lng, kind: 'restaurant' }]} route={[a, b]} fit />
 *   <AppMap picker value={latLng} onChange={setLatLng} />   // tap or drag the map to choose a point
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Camera, type CameraRef, GeoJSONSource, Layer, Map, Marker, UserLocation } from '@maplibre/maplibre-react-native';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { DEFAULT_CENTER, LatLng, boundsFor } from '../../lib/geo';
import { makeStyles, useTheme } from '../../theme';
import { Text } from '../../ui';

export type MapMarkerKind = 'restaurant' | 'home' | 'rider' | 'pin';

export interface MapMarker extends LatLng {
  id: string;
  kind: MapMarkerKind;
  label?: string;
}

export interface AppMapProps {
  markers?: MapMarker[];
  /** Polyline drawn between these points (e.g. restaurant → home). */
  route?: LatLng[];
  /** Fit the camera to markers + route (default when more than one point). */
  fit?: boolean;
  center?: LatLng;
  zoom?: number;
  /** Picker mode: shows a fixed centre pin; `onChange` fires when the map stops moving. */
  picker?: boolean;
  value?: LatLng | null;
  onChange?: (p: LatLng) => void;
  showUserLocation?: boolean;
  interactive?: boolean;
  style?: StyleProp<ViewStyle>;
  rounded?: boolean;
  onPress?: () => void;
}

const STYLE_URL = {
  light: 'https://tiles.openfreemap.org/styles/positron',
  dark: 'https://tiles.openfreemap.org/styles/positron',
};

export default function AppMap({
  markers = [],
  route,
  fit,
  center,
  zoom = 14,
  picker,
  value,
  onChange,
  showUserLocation,
  interactive = true,
  style,
  rounded = true,
  onPress,
}: AppMapProps) {
  const t = useTheme();
  const styles = useStyles();
  const camera = useRef<CameraRef>(null);

  const points = useMemo(() => [...markers, ...(route ?? [])], [markers, route]);
  const shouldFit = fit ?? points.length > 1;
  const initialCenter: LatLng = center ?? value ?? points[0] ?? DEFAULT_CENTER;

  useEffect(() => {
    if (shouldFit && points.length > 1) {
      const b = boundsFor(points);
      camera.current?.fitBounds([b.sw[0], b.sw[1], b.ne[0], b.ne[1]], { padding: { top: 48, bottom: 48, left: 40, right: 40 }, duration: 600 });
    }
  }, [shouldFit, points]);

  // Picker: when `value` changes from outside (e.g. "Use my location"), move the camera there.
  useEffect(() => {
    if (picker && value) camera.current?.easeTo({ center: [value.lng, value.lat], zoom: 16, duration: 500 });
  }, [picker, value?.lat, value?.lng]);

  const routeGeoJson = useMemo<GeoJSON.Feature | null>(
    () =>
      route && route.length > 1
        ? { type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: route.map((p) => [p.lng, p.lat]) } }
        : null,
    [route]
  );

  return (
    <View style={[styles.wrap, rounded && styles.rounded, style]} pointerEvents={interactive ? 'auto' : 'none'}>
      <Map
        style={StyleSheet.absoluteFill}
        mapStyle={t.dark ? STYLE_URL.dark : STYLE_URL.light}
        logo={false}
        attribution
        attributionPosition={{ bottom: 6, right: 6 }}
        compass={false}
        touchRotate={false}
        touchPitch={false}
        dragPan={interactive}
        touchZoom={interactive}
        doubleTapZoom={interactive}
        onPress={() => onPress?.()}
        onRegionDidChange={(e) => {
          if (!picker || !onChange) return;
          if (!e.nativeEvent.userInteraction) return;
          const [lng, lat] = e.nativeEvent.center;
          onChange({ lat, lng });
        }}
      >
        <Camera
          ref={camera}
          initialViewState={{ center: [initialCenter.lng, initialCenter.lat], zoom: picker ? 16 : zoom }}
          maxZoom={19}
        />

        {showUserLocation && <UserLocation />}

        {routeGeoJson && (
          <GeoJSONSource id="route" data={routeGeoJson}>
            <Layer id="route-casing" type="line" style={{ lineColor: t.colors.surface, lineWidth: 7, lineCap: 'round', lineJoin: 'round' }} />
            <Layer id="route-line" type="line" style={{ lineColor: t.colors.primary, lineWidth: 4, lineCap: 'round', lineJoin: 'round', lineDasharray: [0.2, 1.6] }} />
          </GeoJSONSource>
        )}

        {markers.map((m) => (
          <Marker key={m.id} id={m.id} lngLat={[m.lng, m.lat]} anchor="bottom">
            <MarkerPin kind={m.kind} label={m.label} />
          </Marker>
        ))}
      </Map>

      {picker && (
        <View pointerEvents="none" style={styles.centerPin}>
          <MotiView
            from={{ translateY: -6 }}
            animate={{ translateY: 0 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            <MarkerPin kind="pin" />
          </MotiView>
        </View>
      )}
    </View>
  );
}

const PIN_ICON: Record<MapMarkerKind, React.ComponentProps<typeof Ionicons>['name']> = {
  restaurant: 'restaurant',
  home: 'home',
  rider: 'bicycle',
  pin: 'location',
};

export function MarkerPin({ kind, label }: { kind: MapMarkerKind; label?: string }) {
  const t = useTheme();
  const styles = useStyles();
  const bg = kind === 'home' ? t.colors.info : kind === 'rider' ? t.colors.success : t.colors.primary;
  return (
    <View style={styles.pinWrap}>
      {label ? (
        <View style={styles.pinLabel}>
          <Text variant="caption" style={{ fontFamily: t.fonts.bold }} numberOfLines={1}>
            {label}
          </Text>
        </View>
      ) : null}
      <View style={[styles.pinHead, { backgroundColor: bg }]}>
        <Ionicons name={PIN_ICON[kind]} size={16} color="#FFFFFF" />
      </View>
      <View style={[styles.pinTail, { borderTopColor: bg }]} />
      <View style={styles.pinShadow} />
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  wrap: { height: 220, overflow: 'hidden', backgroundColor: t.colors.surfaceMuted },
  rounded: { borderRadius: t.radius.xl },
  centerPin: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', paddingBottom: 36 },
  pinWrap: { alignItems: 'center' },
  pinLabel: {
    backgroundColor: t.colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: t.radius.pill,
    marginBottom: 4,
    maxWidth: 160,
    ...t.shadow(1),
  },
  pinHead: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -2,
  },
  pinShadow: { width: 10, height: 4, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.25)', marginTop: 1 },
}));
