import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';

// The one place fonts are defined. Nunito is a free rounded stand-in for
// Aurel Round (a paid font). To switch: put licensed .otf files in
// assets/fonts/, point `fontAssets` at them, and keep the three family names.

export const fontFamily = {
  regular: 'AppFont-Regular',
  semibold: 'AppFont-SemiBold',
  bold: 'AppFont-Bold',
} as const;

export const fontAssets = {
  [fontFamily.regular]: Nunito_400Regular,
  [fontFamily.semibold]: Nunito_600SemiBold,
  [fontFamily.bold]: Nunito_700Bold,
};

/** Maps a style's `fontWeight` to the matching loaded family. */
export function familyForWeight(weight: string | number | undefined): string {
  const w = weight === 'bold' ? 700 : Number(weight ?? 400);
  if (w >= 700) return fontFamily.bold;
  if (w >= 600) return fontFamily.semibold;
  return fontFamily.regular;
}
