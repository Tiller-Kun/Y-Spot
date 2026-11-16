import Constants from 'expo-constants';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';

import { Text } from '@/components/Text';

import { colors, font, radius, spacing } from '@/constants/theme';
import { useCampus, usePrivacy, type PrivacyPrefs } from '@/state/AppProviders';

const PRIVACY_ROWS: { key: keyof PrivacyPrefs; title: string; body: string }[] = [
  {
    key: 'shareRecommendations',
    title: 'Share my recommended spots',
    body: 'Let other students see spots you recommend.',
  },
  {
    key: 'shareLocationWithFriends',
    title: 'Friend location',
    body: 'Let friends see which study spot you’re at.',
  },
];

export default function ProfileScreen() {
  const { source } = useCampus();
  const { prefs, setPref } = usePrivacy();

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={font.heading}>Privacy</Text>
        <Text style={font.caption}>Everything is off unless you turn it on. These features aren’t live yet, so nothing is shared.</Text>
        {PRIVACY_ROWS.map((row) => (
          <View key={row.key} style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={font.body}>{row.title}</Text>
              <Text style={font.caption}>{row.body}</Text>
            </View>
            <Switch
              value={prefs[row.key]}
              onValueChange={(v) => setPref(row.key, v)}
              trackColor={{ true: colors.primary, false: colors.border }}
            />
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={font.heading}>About Y-Spot</Text>
        {/* TODO: final vision statement and slogan. */}
        <Text style={font.body}>Find your study spot on campus.</Text>
        <Text style={font.caption}>
          Built for students new to Yonsei Sinchon campus, especially exchange and international students.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={font.heading}>Data</Text>
        <Text style={font.caption}>
          Source: {source === 'supabase' ? 'Y-Spot database' : 'Sample data bundled with the app'}
        </Text>
        <Text style={font.caption}>Busyness is an estimated typical pattern, not live data.</Text>
        <Text style={font.caption}>Version {Constants.expoConfig?.version ?? '—'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.lg },
  card: {
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingTop: spacing.sm },
});
