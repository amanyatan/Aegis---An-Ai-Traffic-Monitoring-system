import { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, View } from 'react-native';
import { Camera, ScanEye, Video, Aperture, Focus } from 'lucide-react-native';
import { PALETTE } from '@/constants/neubrutalism';

const { width, height } = Dimensions.get('window');

const ICONS = [Camera, Video, ScanEye, Aperture, Focus] as const;
const COLORS = [PALETTE.cyan, PALETTE.blue, PALETTE.magenta, PALETTE.green, PALETTE.orange];

type Floater = {
  id: number;
  Icon: (typeof ICONS)[number];
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  drift: number;
};

function FloatingCameraIcon({ item }: { item: Floater }) {
  const progress = useRef(new Animated.Value(0)).current;
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
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

    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: item.duration * 2,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const timer = setTimeout(() => {
      floatLoop.start();
      spinLoop.start();
    }, item.delay);

    return () => {
      clearTimeout(timer);
      floatLoop.stop();
      spinLoop.stop();
    };
  }, [item.delay, item.duration, progress, spin]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -item.drift],
  });

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  const { Icon } = item;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.iconWrap,
        {
          left: item.x,
          top: item.y,
          opacity: 0.11,
          transform: [{ translateY }, { rotate }],
        },
      ]}
    >
      <Icon size={item.size} color={item.color} strokeWidth={2} />
    </Animated.View>
  );
}

export function CameraBackground() {
  const floaters = useMemo<Floater[]>(
    () =>
      Array.from({ length: 18 }, (_, id) => ({
        id,
        Icon: ICONS[id % ICONS.length],
        x: Math.random() * (width - 48),
        y: Math.random() * (height - 48),
        size: 22 + Math.floor(Math.random() * 26),
        color: COLORS[id % COLORS.length],
        duration: 4000 + Math.random() * 5000,
        delay: Math.random() * 2000,
        drift: 18 + Math.random() * 28,
      })),
    []
  );

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {floaters.map((item) => (
        <FloatingCameraIcon key={item.id} item={item} />
      ))}
      <View style={styles.wash} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    position: 'absolute',
  },
  wash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
});
