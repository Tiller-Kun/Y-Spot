import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { colors, radius, spacing } from '@/constants/theme';
import type { NoiseLevel } from '@/types/spot';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

const toneColors: Record<BadgeTone, { bg: string; fg: string }> = {
  neutral: { bg: colors.background, fg: colors.textMuted },
  info: { bg: colors.primaryLight, fg: colors.primary },
  success: { bg: colors.successBg, fg: colors.success },
  warning: { bg: colors.warningBg, fg: colors.warning },
  danger: { bg: colors.dangerBg, fg: colors.danger },
};

export const noiseTone: Record<NoiseLevel, BadgeTone> = {
  silent: 'success',
  quiet: 'success',
  moderate: 'warning',
  lively: 'danger',
};

interface Props {
  label: string;
  tone?: BadgeTone;
  icon?: keyof typeof Ionicons.glyphMap;
}

/** Short few-word label like "Quiet" or "Power outlets". */
export function Badge({ label, tone = 'neutral', icon }: Props) {
  const { bg, fg } = toneColors[tone];
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      {icon && <Ionicons name={icon} size={16} color={fg} />}
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.sm,
  },
  label: { fontSize: 14, fontWeight: '600' },
});
