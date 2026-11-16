import { router } from 'expo-router';
import { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/Text';

import { Chip } from '@/components/Chip';
import { NOISE_LABELS, NOISE_LEVELS } from '@/constants/labels';
import { colors, font, radius, spacing } from '@/constants/theme';
import { useNow } from '@/hooks/useNow';
import { useCampus, useFilters } from '@/state/AppProviders';
import { filterSpots, type SpotFilters } from '@/utils/filterSpots';

type AmenityKey = keyof Pick<SpotFilters, 'restroom' | 'food' | 'discussionRooms'>;

const AMENITY_ROWS: { key: AmenityKey; label: string }[] = [
  { key: 'restroom', label: 'Restroom nearby' },
  { key: 'food', label: 'Food nearby' },
  { key: 'discussionRooms', label: 'Discussion rooms' },
];

// DECISION: narrow down to the spot that fits my situation.
export default function FiltersScreen() {
  const { spots } = useCampus();
  const { filters, updateFilters, resetFilters } = useFilters();
  const now = useNow();

  const departments = useMemo(() => [...new Set(spots.flatMap((s) => s.departments))].sort(), [spots]);
  const matchCount = filterSpots(spots, filters, now).length;

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Noise level" hint="Show spots up to this loud">
          <View style={styles.wrap}>
            {NOISE_LEVELS.map((level) => (
              <Chip
                key={level}
                label={NOISE_LABELS[level]}
                selected={filters.maxNoise === level}
                onPress={() => updateFilters({ maxNoise: level })}
              />
            ))}
          </View>
        </Section>

        <Section title="Group size">
          <View style={styles.stepper}>
            <StepButton label="−" onPress={() => updateFilters({ groupSize: Math.max(1, filters.groupSize - 1) })} />
            <Text style={styles.stepValue}>{filters.groupSize}</Text>
            <StepButton label="+" onPress={() => updateFilters({ groupSize: Math.min(12, filters.groupSize + 1) })} />
          </View>
        </Section>

        <Section title="Amenities">
          {AMENITY_ROWS.map((row) => (
            <View key={row.key} style={styles.switchRow}>
              <Text style={font.body}>{row.label}</Text>
              <Switch
                value={filters[row.key]}
                onValueChange={(value) => updateFilters({ [row.key]: value })}
                trackColor={{ true: colors.primary, false: colors.border }}
              />
            </View>
          ))}
        </Section>

        {departments.length > 0 && (
          <Section title="Nearby department">
            <View style={styles.wrap}>
              <Chip label="Any" selected={filters.department === null} onPress={() => updateFilters({ department: null })} />
              {departments.map((d) => (
                <Chip key={d} label={d} selected={filters.department === d} onPress={() => updateFilters({ department: d })} />
              ))}
            </View>
          </Section>
        )}

        <Pressable onPress={resetFilters} accessibilityRole="button">
          <Text style={styles.reset}>Reset all filters</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={styles.primaryButton}
          // Opened via a deep link there's nothing to go back to, so land on Discover.
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>
            Show {matchCount} {matchCount === 1 ? 'spot' : 'spots'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={font.heading}>{title}</Text>
      {hint && <Text style={font.caption}>{hint}</Text>}
      {children}
    </View>
  );
}

function StepButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.stepButton} onPress={onPress} accessibilityRole="button" accessibilityLabel={label === '+' ? 'Increase' : 'Decrease'}>
      <Text style={styles.stepButtonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.lg, gap: spacing.xl },
  section: { gap: spacing.sm },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  stepButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonText: { fontSize: 20, color: colors.primary, fontWeight: '600' },
  stepValue: { fontSize: 18, fontWeight: '700', minWidth: 24, textAlign: 'center', color: colors.text },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.xs },
  reset: { color: colors.primary, fontWeight: '600', textAlign: 'center' },
  footer: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  primaryButton: { backgroundColor: colors.primary, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  primaryButtonText: { color: colors.surface, fontSize: 16, fontWeight: '700' },
});
