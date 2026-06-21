import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TextStyle, StyleProp } from 'react-native';

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  style?: StyleProp<TextStyle>;
};

export function AnimatedCounter({
  value,
  duration = 1200,
  suffix = '',
  prefix = '',
  decimals = 0,
  style,
}: AnimatedCounterProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    anim.setValue(0);
    const listener = anim.addListener(({ value: v }) => {
      setDisplay(v);
    });
    Animated.timing(anim, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();
    return () => anim.removeListener(listener);
  }, [value, duration, anim]);

  const formatted =
    decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return <Text style={style}>{prefix}{formatted}{suffix}</Text>;
}
