import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';

const FIRST_HOUR = 8;
const LAST_HOUR = 22;
const CHART_HEIGHT = 80;

interface Props {
  busyByHour: number[];
  currentHour: number;
}

/** Bar chart of typical occupancy from 08:00 to 22:00, current hour highlighted. */
export function OccupancyChart({ busyByHour, currentHour }: Props) {
  const hours = Array.from({ length: LAST_HOUR - FIRST_HOUR + 1 }, (_, i) => FIRST_HOUR + i);
  return (
    <View>
      <View style={styles.chart}>
        {hours.map((hour) => (
          <View key={hour} style={styles.column}>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(4, (busyByHour[hour] ?? 0) * CHART_HEIGHT),
                  backgroundColor: hour === currentHour ? colors.accent : colors.primaryLight,
                },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.axis}>
        {hours.map((hour) => (
          <Text key={hour} style={styles.tick}>
            {hour % 3 === 0 ? String(hour).padStart(2, '0') : ''}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chart: { flexDirection: 'row', alignItems: 'flex-end', height: CHART_HEIGHT, gap: 3 },
  column: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  axis: { flexDirection: 'row', gap: 3, marginTop: spacing.xs },
  tick: { flex: 1, fontSize: 10, color: colors.textMuted, textAlign: 'center' },
});
