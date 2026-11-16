// Core data model. Mirrors the `buildings` and `spots` tables in
// supabase/migrations — keep the two in sync when adding fields.

export type Intent = 'focus' | 'group' | 'relax';
export type NoiseLevel = 'silent' | 'quiet' | 'moderate' | 'lively';
export type SpotCategory = 'library' | 'lounge' | 'outdoor' | 'cafe' | 'classroom';
export type AccessRule = 'open' | 'student_id' | 'reservation';

/** 24-hour "HH:MM". `close` may be "24:00"; ranges past midnight are not supported yet. */
export interface TimeRange {
  open: string;
  close: string;
}

/** `null` means closed for that part of the week. */
export interface WeeklyHours {
  weekdays: TimeRange | null;
  weekends: TimeRange | null;
}

export interface Amenities {
  outlets: boolean;
  restroom: boolean;
  food: boolean;
  discussionRooms: boolean;
  wifi: boolean;
}

export interface Building {
  id: string;
  name: string;
  nameKo: string;
  /** Position on the schematic campus map, 0–1 from the top-left corner. */
  mapX: number;
  mapY: number;
}

export interface Spot {
  id: string;
  buildingId: string;
  name: string;
  nameKo: string;
  category: SpotCategory;
  floor: string;
  entranceHint: string;
  directions: string;
  noise: NoiseLevel;
  intents: Intent[];
  groupSize: { min: number; max: number };
  hours: WeeklyHours;
  amenities: Amenities;
  access: AccessRule;
  bookable: boolean;
  /** Departments whose buildings are nearby, for the "nearby department" filter. */
  departments: string[];
  walkMinutesFromMainGate: number;
  tip: string | null;
  photoUrl: string | null;
  /** Simulated typical occupancy per hour of day (index 0–23), each 0–1. Not live data. */
  busyByHour: number[];
  /** False until someone on the team has confirmed the details on campus. */
  verified: boolean;
}
