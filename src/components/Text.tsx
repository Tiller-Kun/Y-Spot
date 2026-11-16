import { StyleSheet, Text as RNText, type TextProps } from 'react-native';

import { familyForWeight } from '@/constants/fonts';

// Drop-in replacement for react-native's Text that applies the app font.
// Custom fonts have one family per weight, so `fontWeight` picks the family.
export function Text({ style, ...props }: TextProps) {
  const { fontWeight, ...rest } = StyleSheet.flatten(style) ?? {};
  return <RNText {...props} style={[{ fontFamily: familyForWeight(fontWeight) }, rest]} />;
}
