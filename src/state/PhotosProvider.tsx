import { createContext, useContext, useMemo, type ReactNode } from 'react';

import { usePersistentState } from '@/hooks/usePersistentState';

export interface SharedPhoto {
  id: string;
  spotId: string;
  uri: string;
  /** ISO timestamp of when it was shared. */
  takenAt: string;
}

interface PhotosContextValue {
  /** Newest first. */
  photosFor: (spotId: string) => SharedPhoto[];
  addPhoto: (spotId: string, uri: string) => void;
}

const PhotosContext = createContext<PhotosContextValue | null>(null);

// Photos shared from this device. Not uploaded anywhere yet (see services/photos.ts).
export function PhotosProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = usePersistentState<SharedPhoto[]>('yspot.photos', []);

  const value = useMemo<PhotosContextValue>(
    () => ({
      photosFor: (spotId) =>
        photos.filter((p) => p.spotId === spotId).sort((a, b) => b.takenAt.localeCompare(a.takenAt)),
      addPhoto: (spotId, uri) =>
        setPhotos((prev) => [
          ...prev,
          { id: `${spotId}-${Date.now()}`, spotId, uri, takenAt: new Date().toISOString() },
        ]),
    }),
    [photos, setPhotos],
  );

  return <PhotosContext.Provider value={value}>{children}</PhotosContext.Provider>;
}

export function usePhotos() {
  const ctx = useContext(PhotosContext);
  if (!ctx) throw new Error('usePhotos must be used inside AppProviders');
  return ctx;
}
