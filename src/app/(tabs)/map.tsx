import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { Badge, noiseTone } from '@/components/Badge';
import { LoadingState } from '@/components/ScreenStates';
import { NOISE_LABELS } from '@/constants/labels';
import { colors, font, radius, spacing } from '@/constants/theme';
import { useCampus } from '@/state/AppProviders';

const PIN_WIDTH = 108;
const PIN_HEIGHT = 40;

// DIRECTION: where is it? A schematic campus map (not to scale) showing which
// building each spot is in. A real map SDK can replace this later.
export default function MapScreen() {
  const { spotId } = useLocalSearchParams<{ spotId?: string }>();
  const { spots, buildings, loading, getSpot } = useCampus();
  // "Show on map" from a spot detail preselects that spot's building. A tap on
  // the map overrides it until the next "Show on map" changes `spotId`.
  const [picked, setPicked] = useState<{ forSpotId?: string; buildingId: string | null } | null>(null);
  const selectedBuildingId =
    picked && picked.forSpotId === spotId ? picked.buildingId : spotId ? (getSpot(spotId)?.buildingId ?? null) : null;
  const setSelectedBuildingId = (buildingId: string | null) => setPicked({ forSpotId: spotId, buildingId });

  const spotsInSelected = useMemo(
    () => spots.filter((s) => s.buildingId === selectedBuildingId),
    [spots, selectedBuildingId],
  );
  const selectedBuilding = buildings.find((b) => b.id === selectedBuildingId);

  if (loading) return <LoadingState />;

  return (
    <View style={styles.screen}>
      <View style={styles.map}>
        <View style={styles.road} />
        <Text style={styles.gateLabel}>Main gate ↓</Text>

        {buildings.map((b) => {
          const selected = b.id === selectedBuildingId;
          const count = spots.filter((s) => s.buildingId === b.id).length;
          if (count === 0) return null;
          return (
            <Pressable
              key={b.id}
              onPress={() => setSelectedBuildingId(selected ? null : b.id)}
              accessibilityRole="button"
              accessibilityLabel={`${b.name}, ${count} study ${count === 1 ? 'spot' : 'spots'}`}
              style={[
                styles.pin,
                { left: `${b.mapX * 100}%`, top: `${b.mapY * 100}%` },
                selected && styles.pinSelected,
              ]}
            >
              <Ionicons name="location" size={14} color={selected ? colors.accent : colors.primary} />
              <Text style={[styles.pinText, selected && { color: colors.surface }]} numberOfLines={3}>
                {b.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.footnote}>Schematic map, not to scale. Tap a building to see its spots.</Text>

      <View style={styles.sheet}>
        {selectedBuilding ? (
          <ScrollView contentContainerStyle={{ gap: spacing.sm }}>
            <Text style={font.heading}>
              {selectedBuilding.name} <Text style={font.caption}>{selectedBuilding.nameKo}</Text>
            </Text>
            {spotsInSelected.map((s) => (
              <Pressable
                key={s.id}
                style={styles.spotRow}
                onPress={() => router.push({ pathname: '/spot/[id]', params: { id: s.id } })}
                accessibilityRole="button"
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.spotName}>{s.name}</Text>
                  <Text style={font.caption}>
                    {s.walkMinutesFromMainGate} min walk · {s.entranceHint}
                  </Text>
                </View>
                <Badge label={NOISE_LABELS[s.noise]} tone={noiseTone[s.noise]} />
                <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <Text style={font.caption}>Select a building on the map.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, padding: spacing.lg, gap: spacing.sm },
  map: {
    flex: 1,
    minHeight: 320,
    borderRadius: radius.lg,
    backgroundColor: colors.mapBackground,
    overflow: 'hidden',
  },
  road: { position: 'absolute', top: 0, bottom: 0, left: '55%', width: 14, marginLeft: -7, backgroundColor: colors.mapRoad },
  gateLabel: { position: 'absolute', bottom: spacing.sm, left: '50%', fontSize: 11, color: colors.textMuted, fontWeight: '600' },
  pin: {
    position: 'absolute',
    width: PIN_WIDTH,
    minHeight: PIN_HEIGHT,
    marginLeft: -PIN_WIDTH / 2,
    marginTop: -PIN_HEIGHT / 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pinSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  pinText: { flex: 1, fontSize: 11, fontWeight: '600', color: colors.text },
  footnote: { ...font.caption, fontSize: 12, textAlign: 'center' },
  sheet: {
    maxHeight: 240,
    minHeight: 72,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spotRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  spotName: { fontSize: 15, fontWeight: '700', color: colors.text },
});
