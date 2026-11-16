import { Badge, type BadgeTone } from '@/components/Badge';
import { CROWD_LABELS, crowdLevel } from '@/constants/labels';

const levelTone: Record<keyof typeof CROWD_LABELS, BadgeTone> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
};

/** Green / yellow / red badge for how busy a spot usually is right now. */
export function BusyBadge({ occupancy }: { occupancy: number }) {
  const level = crowdLevel(occupancy);
  return <Badge label={CROWD_LABELS[level]} tone={levelTone[level]} icon="people-outline" />;
}
