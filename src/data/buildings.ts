import type { Building } from '../types/spot';

// PLACEHOLDER positions for the schematic map (not to scale). Adjust after the
// campus walk-through. Relative imports only: scripts/generate-seed.mts loads this file with plain Node.

export const sampleBuildings: Building[] = [
  { id: 'underwood-hall', name: 'Underwood Hall', nameKo: '언더우드관', mapX: 0.55, mapY: 0.1 },
  { id: 'engineering-hall', name: 'Engineering Hall', nameKo: '공학관', mapX: 0.82, mapY: 0.14 },
  { id: 'central-library', name: 'Central Library', nameKo: '중앙도서관', mapX: 0.3, mapY: 0.22 },
  { id: 'student-union', name: 'Student Union', nameKo: '학생회관', mapX: 0.75, mapY: 0.36 },
  { id: 'baekyang-ro', name: 'Baekyang-ro', nameKo: '백양로', mapX: 0.55, mapY: 0.5 },
  { id: 'yonsei-samsung-library', name: 'Yonsei-Samsung Library', nameKo: '학술정보관', mapX: 0.26, mapY: 0.56 },
  { id: 'baekyang-nuri', name: 'Baekyang Nuri', nameKo: '백양누리', mapX: 0.78, mapY: 0.66 },
  { id: 'widang-hall', name: 'Widang Hall', nameKo: '위당관', mapX: 0.26, mapY: 0.8 },
];
