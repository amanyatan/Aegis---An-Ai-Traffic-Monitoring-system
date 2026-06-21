import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

function GridLines() {
  const lines = Array.from({ length: 12 }, (_, i) => i);
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {lines.map((i) => (
        <View
          key={`v-${i}`}
          style={[styles.gridLineV, { left: (width / 12) * i }]}
        />
      ))}
      {lines.map((i) => (
        <View
          key={`h-${i}`}
          style={[styles.gridLineH, { top: (height / 10) * i }]}
        />
      ))}
    </View>
  );
}

function FloatingOrb({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 4000 + delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 4000 + delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    setTimeout(() => loop.start(), delay);
    return () => loop.stop();
  }, [anim, delay]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, -18] });
  const opacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.15, 0.35, 0.15] });

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: size,
          height: size,
          left: x,
          top: y,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
}

export function AegisBackground({ intensity = 1 }: { intensity?: number }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[COLORS.abyss, COLORS.deep, COLORS.abyss]}
        style={StyleSheet.absoluteFill}
      />
      <GridLines />
      <LinearGradient
        colors={['transparent', 'rgba(65, 90, 119, 0.12)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[StyleSheet.absoluteFill, { opacity: intensity }]}
      />
      <FloatingOrb delay={0} x={width * 0.1} y={height * 0.15} size={120} />
      <FloatingOrb delay={800} x={width * 0.7} y={height * 0.55} size={180} />
      <FloatingOrb delay={1600} x={width * 0.4} y={height * 0.75} size={90} />
      <View style={styles.noise} />
    </View>
  );
}

const styles = StyleSheet.create({
  gridLineV: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(119, 141, 169, 0.06)',
  },
  gridLineH: {
    position: 'absolute',
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(119, 141, 169, 0.06)',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: COLORS.slate,
  },
  noise: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});
