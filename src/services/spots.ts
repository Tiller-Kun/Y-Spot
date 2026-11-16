import { sampleBuildings } from '@/data/buildings';
import { sampleSpots } from '@/data/sampleSpots';
import { supabase } from '@/lib/supabase';
import type { Building, Spot } from '@/types/spot';

export type DataSource = 'supabase' | 'sample';

export interface CampusData {
  spots: Spot[];
  buildings: Building[];
  source: DataSource;
}

// Row shapes from supabase/migrations/20261116000000_init.sql.
interface BuildingRow {
  id: string;
  name: string;
  name_ko: string;
  map_x: number;
  map_y: number;
}

interface SpotRow {
  id: string;
  building_id: string;
  name: string;
  name_ko: string;
  category: Spot['category'];
  floor: string;
  entrance_hint: string;
  directions: string;
  noise: Spot['noise'];
  intents: Spot['intents'];
  group_min: number;
  group_max: number;
  hours: Spot['hours'];
  amenities: Spot['amenities'];
  access: Spot['access'];
  bookable: boolean;
  departments: string[];
  walk_minutes: number;
  tip: string | null;
  photo_url: string | null;
  busy_by_hour: number[];
  verified: boolean;
}

function toBuilding(row: BuildingRow): Building {
  return { id: row.id, name: row.name, nameKo: row.name_ko, mapX: row.map_x, mapY: row.map_y };
}

function toSpot(row: SpotRow): Spot {
  return {
    id: row.id,
    buildingId: row.building_id,
    name: row.name,
    nameKo: row.name_ko,
    category: row.category,
    floor: row.floor,
    entranceHint: row.entrance_hint,
    directions: row.directions,
    noise: row.noise,
    intents: row.intents,
    groupSize: { min: row.group_min, max: row.group_max },
    hours: row.hours,
    amenities: row.amenities,
    access: row.access,
    bookable: row.bookable,
    departments: row.departments,
    walkMinutesFromMainGate: row.walk_minutes,
    tip: row.tip,
    photoUrl: row.photo_url,
    busyByHour: row.busy_by_hour,
    verified: row.verified,
  };
}

/** Loads campus data from Supabase, or the bundled sample data when no backend is configured. */
export async function fetchCampusData(): Promise<CampusData> {
  if (!supabase) {
    return { spots: sampleSpots, buildings: sampleBuildings, source: 'sample' };
  }

  const [spots, buildings] = await Promise.all([
    supabase.from('spots').select('*'),
    supabase.from('buildings').select('*'),
  ]);
  if (spots.error) throw spots.error;
  if (buildings.error) throw buildings.error;

  return {
    spots: (spots.data as SpotRow[]).map(toSpot),
    buildings: (buildings.data as BuildingRow[]).map(toBuilding),
    source: 'supabase',
  };
}
