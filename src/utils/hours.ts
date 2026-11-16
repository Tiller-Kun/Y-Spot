import type { TimeRange, WeeklyHours } from '@/types/spot';

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function hoursFor(hours: WeeklyHours, date: Date): TimeRange | null {
  const day = date.getDay();
  return day === 0 || day === 6 ? hours.weekends : hours.weekdays;
}

export function isOpenAt(hours: WeeklyHours, date: Date): boolean {
  const range = hoursFor(hours, date);
  if (!range) return false;
  const now = date.getHours() * 60 + date.getMinutes();
  return now >= toMinutes(range.open) && now < toMinutes(range.close);
}

export function openStatus(hours: WeeklyHours, date: Date): { open: boolean; label: string } {
  const range = hoursFor(hours, date);
  if (!range) return { open: false, label: 'Closed today' };
  if (range.open === '00:00' && range.close === '24:00') return { open: true, label: 'Open 24 hours' };
  if (isOpenAt(hours, date)) return { open: true, label: `Open until ${range.close}` };
  const now = date.getHours() * 60 + date.getMinutes();
  if (now < toMinutes(range.open)) return { open: false, label: `Opens at ${range.open}` };
  return { open: false, label: 'Closed now' };
}

export function formatRange(range: TimeRange | null): string {
  return range ? `${range.open} – ${range.close}` : 'Closed';
}
