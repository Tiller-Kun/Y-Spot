import type { AccessRule, Intent, NoiseLevel, SpotCategory } from '@/types/spot';

// All user-facing wording for badges and filters lives here so it can be
// reviewed and translated in one place.

export const INTENT_OPTIONS: { value: Intent | 'all'; label: string }[] = [
  { value: 'all', label: 'See everything' },
  { value: 'focus', label: 'Focus alone' },
  { value: 'group', label: 'Work in a group' },
  { value: 'relax', label: 'Relax and talk' },
];

/** Ordered quietest to loudest; the filters rely on this order. */
export const NOISE_LEVELS: NoiseLevel[] = ['silent', 'quiet', 'moderate', 'lively'];

export const NOISE_LABELS: Record<NoiseLevel, string> = {
  silent: 'Silent',
  quiet: 'Quiet',
  moderate: 'Moderate',
  lively: 'Talking OK',
};

export const CATEGORY_LABELS: Record<SpotCategory, string> = {
  library: 'Library',
  lounge: 'Lounge',
  outdoor: 'Outdoor',
  cafe: 'Café',
  classroom: 'Classroom',
};

export const ACCESS_LABELS: Record<AccessRule, string> = {
  open: 'Open to everyone',
  student_id: 'Student ID needed',
  reservation: 'Reservation required',
};

export function crowdLabel(occupancy: number): string {
  if (occupancy < 0.3) return 'Plenty of seats';
  if (occupancy < 0.55) return 'Some seats';
  if (occupancy < 0.8) return 'Busy';
  return 'Packed';
}
