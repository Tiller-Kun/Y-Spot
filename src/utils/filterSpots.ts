import { NOISE_LEVELS } from '@/constants/labels';
import type { Intent, NoiseLevel, Spot } from '@/types/spot';
import { isOpenAt } from './hours';

export interface SpotFilters {
  intent: Intent | 'all';
  query: string;
  openNow: boolean;
  outlets: boolean;
  /** Loudest noise level to include. */
  maxNoise: NoiseLevel;
  groupSize: number;
  restroom: boolean;
  food: boolean;
  discussionRooms: boolean;
  department: string | null;
}

export const DEFAULT_FILTERS: SpotFilters = {
  intent: 'all',
  query: '',
  openNow: false,
  outlets: false,
  maxNoise: 'lively',
  groupSize: 1,
  restroom: false,
  food: false,
  discussionRooms: false,
  department: null,
};

/** Number of filters set on the Filters screen (not the chips on Discover). */
export function countAdvancedFilters(f: SpotFilters): number {
  return [
    f.maxNoise !== DEFAULT_FILTERS.maxNoise,
    f.groupSize !== DEFAULT_FILTERS.groupSize,
    f.outlets,
    f.restroom,
    f.food,
    f.discussionRooms,
    f.department !== null,
  ].filter(Boolean).length;
}

export function filterSpots(spots: Spot[], f: SpotFilters, now: Date): Spot[] {
  const query = f.query.trim().toLowerCase();
  const maxNoise = NOISE_LEVELS.indexOf(f.maxNoise);

  return spots
    .filter((s) => {
      if (f.intent !== 'all' && !s.intents.includes(f.intent)) return false;
      if (query && !s.name.toLowerCase().includes(query) && !s.nameKo.includes(query)) return false;
      if (f.openNow && !isOpenAt(s.hours, now)) return false;
      if (f.outlets && !s.amenities.outlets) return false;
      if (NOISE_LEVELS.indexOf(s.noise) > maxNoise) return false;
      if (s.groupSize.max < f.groupSize) return false;
      if (f.restroom && !s.amenities.restroom) return false;
      if (f.food && !s.amenities.food) return false;
      if (f.discussionRooms && !s.amenities.discussionRooms) return false;
      if (f.department && !s.departments.includes(f.department)) return false;
      return true;
    })
    .sort((a, b) => {
      // Open spots first, then closest to the main gate.
      const openDiff = Number(isOpenAt(b.hours, now)) - Number(isOpenAt(a.hours, now));
      return openDiff || a.walkMinutesFromMainGate - b.walkMinutesFromMainGate;
    });
}
