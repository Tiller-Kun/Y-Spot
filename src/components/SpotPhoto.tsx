import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/constants/theme';
import type { SpotCategory } from '@/types/spot';

const categoryIcon: Record<SpotCategory, keyof typeof Ionicons.glyphMap> = {
  library: 'library-outline',
  lounge: 'people-outline',
  outdoor: 'leaf-outline',
  cafe: 'cafe-outline',
  classroom: 'school-outline',
};

interface Props {
  url: string | null;
  category: SpotCategory;
  style?: StyleProp<ViewStyle>;
}

/** Spot photo, or a category icon until real photos are uploaded. */
export function SpotPhoto({ url, category, style }: Props) {
  if (url) {
    return (
      <View style={[styles.frame, style]}>
        <Image source={{ uri: url }} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </View>
    );
  }
  return (
    <View style={[styles.frame, styles.placeholder, style]}>
      <Ionicons name={categoryIcon[category]} size={28} color={colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', backgroundColor: colors.primaryLight },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
});
