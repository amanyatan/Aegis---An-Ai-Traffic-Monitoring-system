import { useEffect, useRef, useState, ReactNode } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

type FadeInProps = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  translateY?: number;
  style?: StyleProp<ViewStyle>;
};

export function FadeIn({
  children,
  delay = 0,
  duration = 600,
  translateY = 20,
  style,
}: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(translateY)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration, useNativeDriver: true }),
        Animated.timing(translate, { toValue: 0, duration, useNativeDriver: true }),
      ]).start();
    }, delay);
    return () => clearTimeout(timer);
  }, [delay, duration, opacity, translate]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY: translate }] }]}>
      {children}
    </Animated.View>
  );
}

export function StaggerChildren({
  children,
  stagger = 80,
  baseDelay = 0,
}: {
  children: ReactNode[];
  stagger?: number;
  baseDelay?: number;
}) {
  return (
    <>
      {children.map((child, i) => (
        <FadeIn key={i} delay={baseDelay + i * stagger}>{child}</FadeIn>
      ))}
    </>
  );
}
