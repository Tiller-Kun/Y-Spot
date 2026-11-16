import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { crowdLabel } from '@/constants/labels';
import { colors, spacing } from '@/constants/theme';

const BARS = 4;

interface Props {
  /** 0–1 typical occupancy for the current hour. */
  occupancy: number;
  showLabel?: boolean;
}

/** Four-bar "how crowded is it usually right now" indicator. */
export function CrowdMeter({ occupancy, showLabel = true }: Props) {
  const filled = Math.max(1, Math.ceil(occupancy * BARS));
  return (
    <View
      style={styles.row}
      accessible
      accessibilityLabel={`Usually ${crowdLabel(occupancy).toLowerCase()} at this hour`}
    >
      <View style={styles.bars}>
        {Array.from({ length: BARS }, (_, i) => (
          <View
            key={i}
            style={[styles.bar, { height: 6 + i * 3 }, i < filled ? styles.filled : styles.empty]}
          />
        ))}
      </View>
      {showLabel && <Text style={styles.label}>{crowdLabel(occupancy)}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  bar: { width: 4, borderRadius: 1 },
  filled: { backgroundColor: colors.primary },
  empty: { backgroundColor: colors.border },
  label: { fontSize: 12, color: colors.textMuted },
});
