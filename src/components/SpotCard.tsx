import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { NOISE_LABELS } from '@/constants/labels';
import { colors, radius, spacing } from '@/constants/theme';
import { useSaved } from '@/state/AppProviders';
import type { Spot } from '@/types/spot';
import { openStatus } from '@/utils/hours';
import { Badge, noiseTone } from './Badge';
import { BusyBadge } from './BusyBadge';
import { SpotPhoto } from './SpotPhoto';

interface Props {
  spot: Spot;
  now: Date;
}

/** Summary card on Discover and Saved. Tapping opens the spot detail. */
export function SpotCard({ spot, now }: Props) {
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(spot.id);
  const status = openStatus(spot.hours, now);

  // The star sits beside the card's pressable area, not inside it, so the two
  // buttons aren't nested (invalid on web and confusing for screen readers).
  return (
    <View style={styles.card}>
      <Pressable
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
        onPress={() => router.push({ pathname: '/spot/[id]', params: { id: spot.id } })}
        accessibilityRole="button"
        accessibilityLabel={`${spot.name}, ${NOISE_LABELS[spot.noise]}, ${status.label}`}
      >
        <SpotPhoto url={spot.photoUrl} category={spot.category} style={styles.photo} />
        <View style={styles.body}>
          <View style={styles.titles}>
            <Text style={styles.name} numberOfLines={1}>
              {spot.name}
            </Text>
            <Text style={styles.nameKo} numberOfLines={1}>
              {spot.nameKo}
            </Text>
          </View>
          <View style={styles.badges}>
            <BusyBadge occupancy={spot.busyByHour[now.getHours()] ?? 0} />
            <Badge label={NOISE_LABELS[spot.noise]} tone={noiseTone[spot.noise]} />
            <Badge label={status.label} tone={status.open ? 'success' : 'neutral'} />
            <Text style={styles.walk}>{spot.walkMinutesFromMainGate} min walk</Text>
          </View>
        </View>
      </Pressable>
      <Pressable
        style={styles.star}
        onPress={() => toggleSaved(spot.id)}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel={saved ? `Remove ${spot.name} from saved` : `Save ${spot.name}`}
      >
        <Ionicons name={saved ? 'star' : 'star-outline'} size={20} color={saved ? colors.accent : colors.textMuted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  main: { flexDirection: 'row' },
  pressed: { opacity: 0.85 },
  photo: { width: 96 },
  body: { flex: 1, padding: spacing.md, gap: spacing.sm },
  titles: { paddingRight: 28 },
  star: { position: 'absolute', top: spacing.md, right: spacing.md },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  nameKo: { fontSize: 13, color: colors.textMuted },
  badges: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.xs },
  walk: { fontSize: 12, color: colors.textMuted, marginLeft: 'auto' },
});
