import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Text } from '@/components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Chip } from '@/components/Chip';
import { ErrorState, LoadingState } from '@/components/ScreenStates';
import { SpotCard } from '@/components/SpotCard';
import { INTENT_OPTIONS } from '@/constants/labels';
import { colors, font, radius, spacing } from '@/constants/theme';
import { useNow } from '@/hooks/useNow';
import { useCampus, useFilters } from '@/state/AppProviders';
import { countAdvancedFilters, filterSpots } from '@/utils/filterSpots';

// DISCOVERY: the home screen shows where you can study right away, with no login or popups.
export default function DiscoverScreen() {
  const { spots, source, loading, error, reload } = useCampus();
  const { filters, updateFilters } = useFilters();
  const now = useNow();

  const results = useMemo(() => filterSpots(spots, filters, now), [spots, filters, now]);
  const advancedCount = countAdvancedFilters(filters);

  const header = (
    <View style={styles.header}>
      <Text style={font.title}>Where do you want to study?</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {INTENT_OPTIONS.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={filters.intent === option.value}
            onPress={() => updateFilters({ intent: option.value })}
          />
        ))}
      </ScrollView>

      <View style={styles.search}>
        <Ionicons name="search" size={16} color={colors.textMuted} />
        <TextInput
          value={filters.query}
          onChangeText={(query) => updateFilters({ query })}
          placeholder="Search by name or 한글"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        <Chip
          label={advancedCount ? `Filters · ${advancedCount}` : 'Filters'}
          icon="options-outline"
          selected={advancedCount > 0}
          onPress={() => router.push('/filters')}
        />
        <Chip label="Open now" icon="time-outline" selected={filters.openNow} onPress={() => updateFilters({ openNow: !filters.openNow })} />
      </ScrollView>

      {source === 'sample' && (
        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
          <Text style={styles.noticeText}>Sample data. Hours and rooms are placeholders until confirmed on campus.</Text>
        </View>
      )}

      <Text style={font.caption}>
        {results.length} {results.length === 1 ? 'spot matches' : 'spots match'} right now
      </Text>
    </View>
  );

  let body;
  if (loading) body = <LoadingState />;
  else if (error) body = <ErrorState message={error} onRetry={reload} />;
  else
    body = (
      <FlatList
        data={results}
        keyExtractor={(s) => s.id}
        renderItem={({ item }) => <SpotCard spot={item} now={now} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <Pressable onPress={() => updateFilters({ intent: 'all', query: '', openNow: false, outlets: false })}>
            <Text style={styles.emptyText}>No spots match. Tap to clear the quick filters.</Text>
          </Pressable>
        }
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        keyboardShouldPersistTaps="handled"
      />
    );

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { gap: spacing.md, marginBottom: spacing.md },
  chipRow: { gap: spacing.sm },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: { flex: 1, paddingVertical: spacing.md, fontSize: 15, color: colors.text },
  notice: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primaryLight,
  },
  noticeText: { flex: 1, fontSize: 13, color: colors.primary },
  emptyText: { ...font.caption, textAlign: 'center', padding: spacing.xl },
});
