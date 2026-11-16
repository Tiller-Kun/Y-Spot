import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { EmptyState } from '@/components/ScreenStates';
import { SpotCard } from '@/components/SpotCard';
import { colors, font, radius, spacing } from '@/constants/theme';
import { useNow } from '@/hooks/useNow';
import { submitSpotSuggestion } from '@/services/suggestions';
import { useCampus, useSaved } from '@/state/AppProviders';

export default function SavedScreen() {
  const { spots } = useCampus();
  const { savedIds } = useSaved();
  const now = useNow();
  const savedSpots = spots.filter((s) => savedIds.includes(s.id));

  return (
    <FlatList
      data={savedSpots}
      keyExtractor={(s) => s.id}
      renderItem={({ item }) => <SpotCard spot={item} now={now} />}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      ListHeaderComponent={savedSpots.length ? <Text style={[font.heading, styles.heading]}>Your spots</Text> : undefined}
      ListEmptyComponent={
        <EmptyState icon="star-outline" title="No saved spots yet" body="Tap the star on any spot to keep it here." />
      }
      ListFooterComponent={<ShareSpotCard />}
      contentContainerStyle={styles.list}
      keyboardShouldPersistTaps="handled"
    />
  );
}

/** "Tell us about a spot we missed." Suggestions go to the team for review. */
function ShareSpotCard() {
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);

  async function send() {
    setSending(true);
    try {
      const result = await submitSpotSuggestion({ name: name.trim(), details: details.trim() });
      Alert.alert(
        result === 'sent' ? 'Thanks!' : 'Not sent yet',
        result === 'sent'
          ? 'We’ll check it out and add it if it fits.'
          : 'Suggestions will start working once the backend is connected.',
      );
      if (result === 'sent') {
        setName('');
        setDetails('');
      }
    } catch {
      Alert.alert('Something went wrong', 'Please try again in a moment.');
    } finally {
      setSending(false);
    }
  }

  return (
    <View style={styles.share}>
      <Text style={font.heading}>Share a spot</Text>
      <Text style={font.caption}>Tell us about a spot we missed.</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Spot name or building"
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
      <TextInput
        value={details}
        onChangeText={setDetails}
        placeholder="What's it like? Floor, noise, outlets…"
        placeholderTextColor={colors.textMuted}
        style={[styles.input, styles.multiline]}
        multiline
      />
      <Pressable
        style={[styles.send, (!name.trim() || sending) && { opacity: 0.5 }]}
        disabled={!name.trim() || sending}
        onPress={send}
        accessibilityRole="button"
      >
        {sending ? <ActivityIndicator color={colors.surface} /> : <Text style={styles.sendText}>Send</Text>}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, flexGrow: 1 },
  heading: { marginBottom: spacing.md },
  share: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 15,
    color: colors.text,
  },
  multiline: { minHeight: 72, textAlignVertical: 'top' },
  send: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
  sendText: { color: colors.surface, fontWeight: '700' },
});
