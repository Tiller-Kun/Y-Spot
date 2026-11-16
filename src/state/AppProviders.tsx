import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { usePersistentState } from '@/hooks/usePersistentState';
import { fetchCampusData, type DataSource } from '@/services/spots';
import type { Building, Spot } from '@/types/spot';
import { DEFAULT_FILTERS, type SpotFilters } from '@/utils/filterSpots';

// ---- Campus data (spots + buildings) ----

interface CampusContextValue {
  spots: Spot[];
  buildings: Building[];
  source: DataSource | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  getSpot: (id: string) => Spot | undefined;
  getBuilding: (id: string) => Building | undefined;
}

const CampusContext = createContext<CampusContextValue | null>(null);

function CampusProvider({ children }: { children: ReactNode }) {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [source, setSource] = useState<DataSource | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchCampusData()
      .then((data) => {
        if (cancelled) return;
        setSpots(data.spots);
        setBuildings(data.buildings);
        setSource(data.source);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load study spots.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setAttempt((n) => n + 1);
  }, []);

  const value = useMemo<CampusContextValue>(
    () => ({
      spots,
      buildings,
      source,
      loading,
      error,
      reload,
      getSpot: (id) => spots.find((s) => s.id === id),
      getBuilding: (id) => buildings.find((b) => b.id === id),
    }),
    [spots, buildings, source, loading, error, reload],
  );

  return <CampusContext.Provider value={value}>{children}</CampusContext.Provider>;
}

export function useCampus() {
  const ctx = useContext(CampusContext);
  if (!ctx) throw new Error('useCampus must be used inside AppProviders');
  return ctx;
}

// ---- Saved spots (stored on the device) ----

interface SavedContextValue {
  savedIds: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
}

const SavedContext = createContext<SavedContextValue | null>(null);

function SavedProvider({ children }: { children: ReactNode }) {
  const [savedIds, setSavedIds] = usePersistentState<string[]>('yspot.savedSpotIds', []);

  const value = useMemo<SavedContextValue>(
    () => ({
      savedIds,
      isSaved: (id) => savedIds.includes(id),
      toggleSaved: (id) =>
        setSavedIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id])),
    }),
    [savedIds, setSavedIds],
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const ctx = useContext(SavedContext);
  if (!ctx) throw new Error('useSaved must be used inside AppProviders');
  return ctx;
}

// ---- Filters (shared by Discover and the Filters modal) ----

interface FiltersContextValue {
  filters: SpotFilters;
  updateFilters: (patch: Partial<SpotFilters>) => void;
  resetFilters: () => void;
}

const FiltersContext = createContext<FiltersContextValue | null>(null);

function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SpotFilters>(DEFAULT_FILTERS);

  const value = useMemo<FiltersContextValue>(
    () => ({
      filters,
      updateFilters: (patch) => setFilters((f) => ({ ...f, ...patch })),
      resetFilters: () => setFilters(DEFAULT_FILTERS),
    }),
    [filters],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  const ctx = useContext(FiltersContext);
  if (!ctx) throw new Error('useFilters must be used inside AppProviders');
  return ctx;
}

// ---- Privacy preferences (Profile tab) ----

export interface PrivacyPrefs {
  shareRecommendations: boolean;
  shareLocationWithFriends: boolean;
}

interface PrivacyContextValue {
  prefs: PrivacyPrefs;
  setPref: (key: keyof PrivacyPrefs, value: boolean) => void;
}

const PrivacyContext = createContext<PrivacyContextValue | null>(null);

function PrivacyProvider({ children }: { children: ReactNode }) {
  // Everything is off by default; sharing is opt-in.
  const [prefs, setPrefs] = usePersistentState<PrivacyPrefs>('yspot.privacy', {
    shareRecommendations: false,
    shareLocationWithFriends: false,
  });

  const value = useMemo<PrivacyContextValue>(
    () => ({ prefs, setPref: (key, v) => setPrefs((p) => ({ ...p, [key]: v })) }),
    [prefs, setPrefs],
  );

  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>;
}

export function usePrivacy() {
  const ctx = useContext(PrivacyContext);
  if (!ctx) throw new Error('usePrivacy must be used inside AppProviders');
  return ctx;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <CampusProvider>
      <SavedProvider>
        <FiltersProvider>
          <PrivacyProvider>{children}</PrivacyProvider>
        </FiltersProvider>
      </SavedProvider>
    </CampusProvider>
  );
}
