import { ReactNode } from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import { COLORS, GLASS, RADIUS } from '@/constants/theme';

type GlassPanelProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  onPress?: () => void;
  glow?: boolean;
  intensity?: number;
};

export function GlassPanel({
  children,
  style,
  contentStyle,
  onPress,
  glow,
  intensity = 40,
}: GlassPanelProps) {
  const inner = (
    <View
      style={[
        styles.panel,
        glow && styles.glow,
        style,
      ]}
    >
      {Platform.OS !== 'web' ? (
        <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  panel: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: GLASS.border,
    backgroundColor: GLASS.bg,
    overflow: 'hidden',
  },
  glow: {
    borderColor: GLASS.borderGlow,
    shadowColor: COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 6,
  },
  content: {
    padding: 20,
  },
});
