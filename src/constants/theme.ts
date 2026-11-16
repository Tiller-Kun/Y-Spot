// White and blue, kept simple to avoid information overload.

export const colors = {
  primary: '#1B3C73',
  primaryLight: '#E8EEF8',
  accent: '#F5B400',
  background: '#F5F7FB',
  surface: '#FFFFFF',
  text: '#14213D',
  textMuted: '#5B6478',
  border: '#DDE3EE',
  success: '#1F7A45',
  successBg: '#E3F4EA',
  warning: '#8A5A00',
  warningBg: '#FFF4D6',
  danger: '#A63D28',
  dangerBg: '#FBE7E2',
  mapBackground: '#DCE6F5',
  mapRoad: '#C3D2EA',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const font = {
  title: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  heading: { fontSize: 18, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, color: colors.text },
  caption: { fontSize: 13, color: colors.textMuted },
};
