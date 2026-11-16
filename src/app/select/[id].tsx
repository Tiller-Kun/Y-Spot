import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { EmptyState } from '@/components/ScreenStates';
import { Text } from '@/components/Text';
import { colors, font, radius, spacing } from '@/constants/theme';
import { useNow } from '@/hooks/useNow';
import { keepPhotoOnDevice } from '@/services/photos';
import { useCampus } from '@/state/AppProviders';
import { usePhotos } from '@/state/PhotosProvider';
import { timeAgo } from '@/utils/time';

const PHOTO_RULES = [
  'No faces or people in the frame',
  'No names, ID cards, screens or documents',
  'Show the space and how full it is',
];

const PICKER_OPTIONS = { mediaTypes: ['images'] as ImagePicker.MediaType[], quality: 0.7, exif: false };

// After tapping "Select" on a spot: optionally share a photo, then see recent
// photos of the space (a "live-ish" look at how busy it is).
export default function SelectSpotScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getSpot } = useCampus();
  const { photosFor, addPhoto } = usePhotos();
  const now = useNow();
  const [agreed, setAgreed] = useState(false);

  const spot = getSpot(id);
  if (!spot) {
    return <EmptyState icon="help-circle-outline" title="Spot not found" body="It may have been removed or renamed." />;
  }
  const photos = photosFor(spot.id);

  const finish = (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled) return;
    addPhoto(spot.id, keepPhotoOnDevice(result.assets[0].uri));
    setAgreed(false);
  };

  const takePhoto = async () => {
    const { granted } = await ImagePicker.requestCameraPermissionsAsync();
    if (!granted) {
      Alert.alert('Camera is off', 'Allow camera access in Settings, or choose a photo instead.');
      return;
    }
    finish(await ImagePicker.launchCameraAsync(PICKER_OPTIONS));
  };

  const choosePhoto = async () => finish(await ImagePicker.launchImageLibraryAsync(PICKER_OPTIONS));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={{ gap: 2 }}>
        <Text style={font.title}>{spot.name}</Text>
        <Text style={font.caption}>You selected this spot. Sharing a photo is optional.</Text>
      </View>

      <View style={styles.card}>
        <Text style={font.heading}>Share a photo (optional)</Text>
        <Text style={font.body}>Help others see how the space looks right now. Please keep it anonymous:</Text>
        {PHOTO_RULES.map((rule) => (
          <View key={rule} style={styles.row}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} />
            <Text style={[font.body, { flex: 1 }]}>{rule}</Text>
          </View>
        ))}

        <Pressable
          style={styles.row}
          onPress={() => setAgreed((a) => !a)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: agreed }}
        >
          <Ionicons name={agreed ? 'checkbox' : 'square-outline'} size={24} color={colors.primary} />
          <Text style={[font.body, { flex: 1 }]}>My photo has no faces or personal information.</Text>
        </Pressable>

        <View style={styles.buttons}>
          <ShareButton icon="camera-outline" label="Take photo" onPress={takePhoto} disabled={!agreed} />
          <ShareButton icon="images-outline" label="Choose photo" onPress={choosePhoto} disabled={!agreed} />
        </View>
        <Text style={styles.note}>
          Prototype: photos are saved on this device only and are not shared with other students yet.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={font.heading}>Recent photos</Text>
        {photos.length === 0 ? (
          <Text style={font.caption}>No photos yet. Be the first to share one.</Text>
        ) : (
          <View style={styles.grid}>
            {photos.map((p) => (
              <View key={p.id} style={styles.tile}>
                <Image source={{ uri: p.uri }} style={styles.photo} accessibilityLabel={`Photo of ${spot.name}`} />
                <Text style={styles.ago}>{timeAgo(p.takenAt, now)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function ShareButton({
  icon,
  label,
  onPress,
  disabled,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  disabled: boolean;
}) {
  return (
    <Pressable
      style={[styles.button, disabled && { opacity: 0.4 }]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Ionicons name={icon} size={20} color={colors.surface} />
      <Text style={styles.buttonText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.lg },
  card: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  buttons: { flexDirection: 'row', gap: spacing.md },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  buttonText: { color: colors.surface, fontSize: 15, fontWeight: '700' },
  note: { fontSize: 12, color: colors.warning },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  tile: { width: '47%', gap: spacing.xs },
  photo: { width: '100%', aspectRatio: 1, borderRadius: radius.md, backgroundColor: colors.primaryLight },
  ago: { fontSize: 12, color: colors.textMuted },
});
