import { File, Paths } from 'expo-file-system';
import { Platform } from 'react-native';

// Photos stay on the device for now. Flip this only after faces are blurred
// before upload (planned server-side step) and the storage migration is applied.
export const UPLOADS_ENABLED = false;

/**
 * Copies a picked photo into the app's own folder, because the picker's file
 * lives in a cache the system can clear. On web (no file system) and on any
 * failure, the original uri is kept.
 */
export function keepPhotoOnDevice(uri: string): string {
  if (Platform.OS === 'web') return uri;
  try {
    const copy = new File(Paths.document, `yspot-${Date.now()}.jpg`);
    new File(uri).copy(copy);
    return copy.uri;
  } catch {
    return uri;
  }
}
