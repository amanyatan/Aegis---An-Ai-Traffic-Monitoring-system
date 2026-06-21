import { useEffect, useMemo } from 'react';
import { Dimensions, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { COLORS } from '@/constants/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type FallingPatternProps = {
  color?: string;
  backgroundColor?: string;
  duration?: number;
  blurIntensity?: number | string;
  density?: number;
  style?: ViewStyle;
};

type Streak = {
  id: number;
  x: number;
  height: number;
  width: number;
  opacity: number;
  delay: number;
};

function createStreaks(count: number, density: number): Streak[] {
  return Array.from({ length: count }, (_, id) => ({
    id,
    x: Math.random() * SCREEN_WIDTH,
    height: 40 + Math.random() * 80,
    width: 1 + Math.random() * 2,
    opacity: 0.08 + Math.random() * 0.22,
    delay: Math.random() * 4000 * density,
  }));
}

function FallingStreak({
  streak,
  color,
  duration,
}: {
  streak: Streak;
  color: string;
  duration: number;
}) {
  const translateY = useSharedValue(-streak.height);

  useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withRepeat(
        withTiming(SCREEN_HEIGHT + streak.height, {
          duration: duration * 1000 * (0.6 + Math.random() * 0.8),
          easing: Easing.linear,
        }),
        -1,
        false
      );
    }, streak.delay);

    return () => clearTimeout(timeout);
  }, [duration, streak.delay, streak.height, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: streak.x,
          top: 0,
          width: streak.width,
          height: streak.height,
          borderRadius: streak.width,
          backgroundColor: color,
          opacity: streak.opacity,
        },
        animatedStyle,
      ]}
    />
  );
}

export function FallingPattern({
  color = COLORS.softAccent,
  backgroundColor = COLORS.primary,
  duration = 150,
  blurIntensity = 12,
  density = 1,
  style,
}: FallingPatternProps) {
  const streaks = useMemo(() => createStreaks(Math.floor(48 / density), density), [density]);
  const resolvedBlur =
    typeof blurIntensity === 'string' ? parseFloat(blurIntensity) || 12 : blurIntensity;
  const dots = useMemo(() => {
    const spacing = 8 * density;
    const cols = Math.ceil(SCREEN_WIDTH / spacing);
    const rows = Math.ceil(SCREEN_HEIGHT / spacing) + 4;
    return Array.from({ length: cols * rows }, (_, i) => ({
      id: i,
      left: (i % cols) * spacing,
      top: Math.floor(i / cols) * spacing,
    }));
  }, [density]);

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor }, style]}>
      {streaks.map((streak) => (
        <FallingStreak key={streak.id} streak={streak} color={color} duration={duration} />
      ))}

      {dots.map((dot) => (
        <View
          key={dot.id}
          style={{
            position: 'absolute',
            left: dot.left,
            top: dot.top,
            width: 2,
            height: 2,
            borderRadius: 1,
            backgroundColor: color,
            opacity: 0.12,
          }}
        />
      ))}

      <BlurView intensity={resolvedBlur} tint="dark" style={StyleSheet.absoluteFill} />
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: 'rgba(13, 27, 42, 0.35)',
          },
        ]}
      />
    </View>
  );
}
