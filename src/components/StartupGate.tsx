import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { SpinningY } from '@/components/SpinningY';
import { fontAssets } from '@/constants/fonts';
import { colors } from '@/constants/theme';
import { useCampus } from '@/state/AppProviders';

SplashScreen.preventAutoHideAsync();

const MIN_SHOW_MS = 900; // long enough to see the Y spin even when loading is instant

// Shows a spinning Y while fonts and campus data load, then pops into the app.
export function StartupGate({ children }: { children: ReactNode }) {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const { loading } = useCampus();
  const [minElapsed, setMinElapsed] = useState(false);
  const [overlayGone, setOverlayGone] = useState(false);
  const [pop] = useState(() => new Animated.Value(0));

  const ready = (fontsLoaded || !!fontError) && !loading && minElapsed;

  useEffect(() => {
    // Hide the static native splash as soon as JS can draw the spinner.
    SplashScreen.hide();
    const t = setTimeout(() => setMinElapsed(true), MIN_SHOW_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    Animated.spring(pop, { toValue: 1, friction: 7, tension: 90, useNativeDriver: true }).start(() =>
      setOverlayGone(true),
    );
  }, [ready, pop]);

  const appStyle = {
    flex: 1,
    opacity: pop,
    transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }],
  };
  const overlayStyle = {
    opacity: pop.interpolate({ inputRange: [0, 0.6], outputRange: [1, 0], extrapolate: 'clamp' as const }),
    transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [1, 1.4], easing: Easing.out(Easing.cubic) }) }],
  };

  return (
    <View style={styles.root}>
      {(fontsLoaded || fontError) && <Animated.View style={appStyle}>{children}</Animated.View>}
      {!overlayGone && (
        <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents={ready ? 'none' : 'auto'}>
          <SpinningY />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  overlay: { ...StyleSheet.absoluteFill as object, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primaryLight },
});
