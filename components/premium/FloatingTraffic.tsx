import { useEffect, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

const ICONS = ['🚗', '🏍', '🚦', '📡', '🛰', '⚠'] as const;

type Floater = {
  id: number;
  icon: string;
  x: number;
  y: number;
  duration: number;
  delay: number;
};

export function FloatingTrafficElements() {
  const floaters = useRef<Floater[]>(
    Array.from({ length: 10 }, (_, id) => ({
      id,
      icon: ICONS[id % ICONS.length],
      x: Math.random() * (width - 40),
      y: Math.random() * (height - 40),
      duration: 5000 + Math.random() * 4000,
      delay: Math.random() * 2000,
    }))
  ).current;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {floaters.map((f) => <FloatingIcon key={f.id} item={f} />)}
    </View>
  );
}

function FloatingIcon({ item }: { item: Floater }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: item.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: item.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );
    const t = setTimeout(() => loop.start(), item.delay);
    return () => {
      clearTimeout(t);
      loop.stop();
    };
  }, [item.delay, item.duration, progress]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -24] });
  const opacity = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.06, 0.14, 0.06] });

  return (
    <Animated.Text
      style={[
        styles.icon,
        {
          left: item.x,
          top: item.y,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {item.icon}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  icon: {
    position: 'absolute',
    fontSize: 22,
    color: COLORS.mist,
  },
});
