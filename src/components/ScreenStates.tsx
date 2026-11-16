import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/Text';

import { colors, font, spacing } from '@/constants/theme';

export function LoadingState() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.center}>
      <Ionicons name="cloud-offline-outline" size={32} color={colors.textMuted} />
      <Text style={styles.text}>{message}</Text>
      <Pressable onPress={onRetry} accessibilityRole="button">
        <Text style={styles.link}>Try again</Text>
      </Pressable>
    </View>
  );
}

export function EmptyState({ icon, title, body }: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }) {
  return (
    <View style={styles.center}>
      <Ionicons name={icon} size={32} color={colors.textMuted} />
      <Text style={font.heading}>{title}</Text>
      <Text style={styles.text}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: spacing.sm },
  text: { ...font.caption, textAlign: 'center' },
  link: { color: colors.primary, fontWeight: '700' },
});
