import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { Badge, noiseTone } from '@/components/Badge';
import { BusyBadge } from '@/components/BusyBadge';
import { EmptyState } from '@/components/ScreenStates';
import { SpotPhoto } from '@/components/SpotPhoto';
import { ACCESS_LABELS, CATEGORY_LABELS, NOISE_LABELS } from '@/constants/labels';
import { colors, font, radius, spacing } from '@/constants/theme';
import { useNow } from '@/hooks/useNow';
import { useCampus, useSaved } from '@/state/AppProviders';
import type { Amenities } from '@/types/spot';
import { formatRange, openStatus } from '@/utils/hours';

const AMENITY_LABELS: Record<keyof Amenities, string> = {
  outlets: 'Power outlets',
  restroom: 'Restroom nearby',
  food: 'Food nearby',
  discussionRooms: 'Discussion rooms',
  wifi: 'Wi-Fi',
};

// Spot detail: everything you need to decide before walking over.
export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSpot, getBuilding } = useCampus();
  const { isSaved, toggleSaved } = useSaved();
  const now = useNow();

  const spot = getSpot(id);
  if (!spot) {
    return <EmptyState icon="help-circle-outline" title="Spot not found" body="It may have been removed or renamed." />;
  }

  const building = getBuilding(spot.buildingId);
  const status = openStatus(spot.hours, now);
  const saved = isSaved(spot.id);

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: spot.name,
          headerRight: () => (
            <Pressable
              onPress={() => toggleSaved(spot.id)}
              hitSlop={12}
              style={{ paddingHorizontal: spacing.md }}
              accessibilityLabel={saved ? 'Remove from saved' : 'Save spot'}
            >
              <Ionicons name={saved ? 'star' : 'star-outline'} size={22} color={saved ? colors.accent : colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <SpotPhoto url={spot.photoUrl} category={spot.category} style={styles.hero} />

        <View style={styles.block}>
          <Text style={font.title}>{spot.name}</Text>
          <Text style={font.caption}>
            {spot.nameKo} · {building?.name ?? 'Unknown building'} · {CATEGORY_LABELS[spot.category]}
          </Text>
          <View style={styles.badges}>
            <BusyBadge occupancy={spot.busyByHour[now.getHours()] ?? 0} />
            <Badge label={NOISE_LABELS[spot.noise]} tone={noiseTone[spot.noise]} icon="volume-medium-outline" />
            <Badge label={status.label} tone={status.open ? 'success' : 'neutral'} icon="time-outline" />
            <Badge label={ACCESS_LABELS[spot.access]} tone={spot.access === 'open' ? 'info' : 'warning'} icon="key-outline" />
            <Badge
              label={spot.groupSize.max === 1 ? 'Solo seats' : `Up to ${spot.groupSize.max} people`}
              tone="info"
              icon="people-outline"
            />
          </View>
          <Text style={font.caption}>Estimated typical pattern, not live data.</Text>
          {!spot.verified && <Text style={styles.unverified}>Details not yet confirmed on campus.</Text>}
        </View>

        <Card title="Getting there">
          <Row icon="walk-outline" text={`${spot.walkMinutesFromMainGate} min walk from the main gate`} />
          <Row icon="enter-outline" text={spot.entranceHint} />
          <Row icon="layers-outline" text={`Floor: ${spot.floor}`} />
          <Text style={font.body}>{spot.directions}</Text>
        </Card>

        <Card title="Before you go">
          <Row icon="calendar-outline" text={`Weekdays ${formatRange(spot.hours.weekdays)}`} />
          <Row icon="calendar-outline" text={`Weekends ${formatRange(spot.hours.weekends)}`} />
          {(Object.keys(AMENITY_LABELS) as (keyof Amenities)[]).map((key) => (
            <Row
              key={key}
              icon={spot.amenities[key] ? 'checkmark-circle-outline' : 'close-circle-outline'}
              text={AMENITY_LABELS[key]}
              muted={!spot.amenities[key]}
            />
          ))}
        </Card>

        {spot.tip && (
          <View style={styles.tip}>
            <Ionicons name="bulb-outline" size={18} color={colors.primary} />
            <Text style={styles.tipText}>{spot.tip}</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => router.navigate({ pathname: '/map', params: { spotId: spot.id } })}
          accessibilityRole="button"
        >
          <Text style={[styles.buttonText, { color: colors.primary }]}>Show On Map</Text>
        </Pressable>
        {spot.bookable && (
          <Pressable
            style={[styles.button, styles.primary]}
            // TODO: link out to mY-Seat2 once we confirm how to deep link into it.
            onPress={() => Alert.alert('Reserve a seat', 'Seats here are booked through the mY-Seat2 app.')}
            accessibilityRole="button"
          >
            <Text style={[styles.buttonText, { color: colors.surface }]}>Reserve seat</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={font.heading}>{title}</Text>
      {children}
    </View>
  );
}

function Row({ icon, text, muted }: { icon: keyof typeof Ionicons.glyphMap; text: string; muted?: boolean }) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={18} color={muted ? colors.textMuted : colors.primary} />
      <Text style={[font.body, muted && { color: colors.textMuted }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: spacing.xl, gap: spacing.lg },
  hero: { height: 200 },
  block: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  unverified: { fontSize: 12, color: colors.warning },
  card: {
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  tip: {
    marginHorizontal: spacing.lg,
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
  },
  tipText: { flex: 1, color: colors.primary, fontSize: 14 },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: { flex: 1, paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center' },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.primaryLight },
  buttonText: { fontSize: 16, fontWeight: '700' },
});
