import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

import { colors } from '@/constants/theme';

const DOT_COUNT = 12;

// A "Y" built from three rounded bars, ringed by orbiting blue and yellow dots.
// Everything is drawn with Views, so it needs no font or image to load.
export function SpinningY({ size = 72 }: { size?: number }) {
  const [spin] = useState(() => new Animated.Value(0));
  const [orbit] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loops = [
      Animated.loop(
        Animated.timing(spin, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.cubic), useNativeDriver: true }),
      ),
      Animated.loop(Animated.timing(orbit, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true })),
    ];
    loops.forEach((l) => l.start());
    return () => loops.forEach((l) => l.stop());
  }, [spin, orbit]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const orbitRotate = orbit.interpolate({ inputRange: [0, 1], outputRange: ['360deg', '0deg'] });
  const bar = size * 0.2;
  const arm = size * 0.52;
  const ring = size * 2;

  return (
    <View style={[styles.box, { width: ring, height: ring }]}>
      <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ rotate: orbitRotate }] }]}>
        {Array.from({ length: DOT_COUNT }, (_, i) => {
          // Dots shrink and fade around the ring, so the orbit reads as a comet trail.
          const t = 1 - i / DOT_COUNT;
          const dot = size * (0.06 + 0.1 * t);
          return (
            <View
              key={i}
              style={[StyleSheet.absoluteFill, { alignItems: 'center', transform: [{ rotate: `${i * (360 / DOT_COUNT)}deg` }] }]}
            >
              <View
                style={{
                  width: dot,
                  height: dot,
                  borderRadius: dot,
                  opacity: 0.25 + 0.75 * t,
                  backgroundColor: i % 2 === 0 ? colors.primary : colors.accent,
                }}
              />
            </View>
          );
        })}
      </Animated.View>

      <Animated.View style={[{ width: size, height: size, transform: [{ rotate }] }, styles.box]}>
        <View style={[styles.arm, { width: bar, height: arm, left: size * 0.5 - bar / 2 - arm * 0.25, top: size * 0.06, transform: [{ rotate: '-35deg' }] }]} />
        <View style={[styles.arm, { width: bar, height: arm, left: size * 0.5 - bar / 2 + arm * 0.25, top: size * 0.06, transform: [{ rotate: '35deg' }] }]} />
        <View style={[styles.arm, { width: bar, height: size * 0.5, left: size * 0.5 - bar / 2, top: size * 0.46, backgroundColor: colors.accent }]} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', justifyContent: 'center' },
  arm: { position: 'absolute', borderRadius: 999, backgroundColor: colors.primary },
});
