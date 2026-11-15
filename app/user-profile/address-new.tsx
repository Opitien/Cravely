import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Switch, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import AppMap from '../../src/components/map/AppMap';
import { useCreateAddress, useProfile } from '../../src/hooks/queries';
import { getErrorMessage } from '../../src/lib/format';
import { DEFAULT_CENTER, LatLng, joinAddress } from '../../src/lib/geo';
import { isValidPhone } from '../../src/lib/validation';
import { makeStyles, useTheme } from '../../src/theme';
import { BottomBar, Button, Chip, Text, TextField } from '../../src/ui';

type Errors = Partial<Record<'line1' | 'city' | 'state' | 'phone', string>>;
const LABELS = ['Home', 'Work', 'Other'];

/**
 * New delivery address. The map is the primary input: "Use my location" or drag the map so the pin
 * sits on the door, and the street / city / state fields fill themselves (reverse geocoding). The user
 * can still correct the text. Coordinates are saved with the address so orders can be mapped and routed.
 */
export default function NewAddressScreen() {
  const t = useTheme();
  const styles = useStyles();
  const router = useRouter();
  const { data: profile } = useProfile();
  const create = useCreateAddress();

  const [label, setLabel] = useState('Home');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [instructions, setInstructions] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const [point, setPoint] = useState<LatLng | null>(null);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);
  const geocodeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userEditedText = useRef(false);

  // Fill the text fields from a coordinate (debounced while the map is moving).
  const reverseGeocode = useCallback((p: LatLng) => {
    if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    geocodeTimer.current = setTimeout(async () => {
      setGeocoding(true);
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude: p.lat, longitude: p.lng });
        if (place && !userEditedText.current) {
          const street = joinAddress([place.streetNumber, place.street || place.name]);
          const area = joinAddress([place.district, place.subregion]);
          setLine1(street && area ? `${street}, ${area}` : street || area || line1);
          setCity(place.city || place.subregion || city);
          setState((place.region || state).replace(/ State$/i, ''));
        }
      } catch {
        // Geocoding is best-effort; the user can type the address.
      } finally {
        setGeocoding(false);
      }
    }, 450);
  }, [city, line1, state]);

  const onMapChange = useCallback(
    (p: LatLng) => {
      setPoint(p);
      reverseGeocode(p);
    },
    [reverseGeocode]
  );

  const useMyLocation = useCallback(async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationDenied(true);
        return;
      }
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
      userEditedText.current = false;
      const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setPoint(p);
      reverseGeocode(p);
    } catch (e) {
      Alert.alert('Could not get your location', getErrorMessage(e, 'Try again or move the map to your door.'));
    } finally {
      setLocating(false);
    }
  }, [reverseGeocode]);

  // Open on the user's location when permission is already granted.
  useEffect(() => {
    Location.getForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status === 'granted') useMyLocation();
      })
      .catch(() => undefined);
    return () => {
      if (geocodeTimer.current) clearTimeout(geocodeTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const edited = (setter: (v: string) => void) => (v: string) => {
    userEditedText.current = true;
    setter(v);
  };

  const handleSave = () => {
    const next: Errors = {};
    if (line1.trim().length < 5) next.line1 = 'Enter your street address.';
    if (!city.trim()) next.city = 'Required';
    if (!state.trim()) next.state = 'Required';
    if (!isValidPhone(phone)) next.phone = 'Enter a valid Nigerian phone number for the rider.';
    setErrors(next);
    if (Object.keys(next).length) return;

    create.mutate(
      { label, line1, city, state, phone, instructions: instructions || null, isDefault, lat: point?.lat ?? null, lng: point?.lng ?? null },
      {
        onSuccess: () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
          router.back();
        },
        onError: (e) => Alert.alert('Could not save address', getErrorMessage(e)),
      }
    );
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {/* Map picker */}
        <View style={styles.mapCard}>
          <AppMap picker value={point} onChange={onMapChange} center={point ?? DEFAULT_CENTER} showUserLocation style={styles.map} rounded={false} />
          <Pressable
            onPress={useMyLocation}
            disabled={locating}
            accessibilityRole="button"
            accessibilityLabel="Use my current location"
            style={({ pressed }) => [styles.locateButton, pressed && { opacity: 0.8 }]}
          >
            {locating ? <ActivityIndicator size="small" color={t.colors.primary} /> : <Ionicons name="locate" size={20} color={t.colors.primary} />}
          </Pressable>
          <View style={styles.mapHint}>
            {geocoding ? (
              <ActivityIndicator size="small" color={t.colors.primary} />
            ) : (
              <Ionicons name={point ? 'checkmark-circle' : 'move'} size={16} color={point ? t.colors.success : t.colors.textSecondary} />
            )}
            <Text variant="caption" tone="secondary" style={{ flex: 1 }} numberOfLines={1}>
              {geocoding ? 'Finding the address…' : point ? 'Pin set. Drag the map to adjust.' : 'Drag the map so the pin is on your door'}
            </Text>
          </View>
        </View>

        {locationDenied && (
          <MotiView from={{ opacity: 0, translateY: -6 }} animate={{ opacity: 1, translateY: 0 }} style={styles.notice}>
            <Ionicons name="information-circle" size={18} color={t.colors.info} />
            <Text variant="caption" tone="secondary" style={{ flex: 1 }}>
              Location is off for Cravely. You can still drag the map or type the address.
            </Text>
          </MotiView>
        )}

        <Text variant="label" tone="secondary" style={styles.labelTitle}>
          Save as
        </Text>
        <View style={styles.labels}>
          {LABELS.map((l) => (
            <Chip key={l} label={l} selected={label === l} onPress={() => setLabel(l)} />
          ))}
        </View>

        <TextField
          label="Street address"
          icon="location-outline"
          value={line1}
          onChangeText={edited(setLine1)}
          placeholder="12 Admiralty Way, Lekki Phase 1"
          autoComplete="street-address"
          error={errors.line1}
        />
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <TextField label="City" value={city} onChangeText={edited(setCity)} placeholder="Lagos" error={errors.city} />
          </View>
          <View style={{ flex: 1 }}>
            <TextField label="State" value={state} onChangeText={edited(setState)} placeholder="Lagos" error={errors.state} />
          </View>
        </View>
        <TextField
          label="Phone for delivery"
          icon="call-outline"
          value={phone}
          onChangeText={setPhone}
          placeholder="0803 123 4567"
          keyboardType="phone-pad"
          autoComplete="tel"
          error={errors.phone}
        />
        <TextField
          label="Directions for the rider (optional)"
          value={instructions}
          onChangeText={setInstructions}
          placeholder="Gate code, landmark, floor…"
          multiline
          maxLength={200}
        />

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text variant="bodyStrong">Make default</Text>
            <Text variant="caption" tone="muted">
              Used automatically at checkout
            </Text>
          </View>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ true: t.colors.primary, false: t.colors.borderStrong }}
            thumbColor="#FFFFFF"
          />
        </View>
      </ScrollView>
      <BottomBar>
        <Button title="Save address" onPress={handleSave} loading={create.isPending} />
      </BottomBar>
    </KeyboardAvoidingView>
  );
}

const useStyles = makeStyles((t) => ({
  screen: { flex: 1, backgroundColor: t.colors.background },
  content: { padding: t.spacing.xl, paddingTop: t.spacing.sm },
  mapCard: { borderRadius: t.radius.xl, overflow: 'hidden', backgroundColor: t.colors.surface, marginBottom: t.spacing.xl, ...t.shadow(1) },
  map: { height: 260 },
  locateButton: {
    position: 'absolute',
    right: t.spacing.md,
    top: t.spacing.md,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...t.shadow(2),
  },
  mapHint: { flexDirection: 'row', alignItems: 'center', gap: t.spacing.sm, paddingHorizontal: t.spacing.lg, paddingVertical: t.spacing.md },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.sm,
    padding: t.spacing.md,
    borderRadius: t.radius.md,
    backgroundColor: t.colors.infoSoft,
    marginBottom: t.spacing.lg,
  },
  labelTitle: { marginBottom: t.spacing.sm, marginLeft: 2 },
  labels: { flexDirection: 'row', gap: t.spacing.sm, marginBottom: t.spacing.xl },
  row: { flexDirection: 'row', gap: t.spacing.md },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: t.spacing.md,
    padding: t.spacing.lg,
    borderRadius: t.radius.lg,
    backgroundColor: t.colors.surface,
    ...t.shadow(1),
  },
}));
