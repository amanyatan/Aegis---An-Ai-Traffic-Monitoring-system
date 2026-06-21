import { ReactNode } from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { NEU } from '@/constants/neubrutalism';

type NeoCardProps = {
  children: ReactNode;
  backgroundColor?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  shadow?: boolean;
};

export function NeoCard({
  children,
  backgroundColor = '#FFFFFF',
  onPress,
  style,
  contentStyle,
  shadow = true,
}: NeoCardProps) {
  const inner = (
    <View
      style={[
        styles.card,
        { backgroundColor, borderColor: NEU.ink },
        contentStyle,
      ]}
    >
      {children}
    </View>
  );

  const body = shadow ? (
    <View style={[styles.wrap, style]}>
      <View style={[styles.shadow, { backgroundColor: NEU.ink }]} />
      {inner}
    </View>
  ) : (
    <View style={style}>{inner}</View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [pressed && styles.pressed]}>
        {body}
      </Pressable>
    );
  }

  return body;
}

type NeoIconBoxProps = {
  children: ReactNode;
  fill: string;
  size?: number;
};

export function NeoIconBox({ children, fill, size = 44 }: NeoIconBoxProps) {
  return (
    <View style={[styles.iconBox, { width: size, height: size, backgroundColor: fill, borderColor: NEU.ink }]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'relative',
    marginBottom: NEU.shadowOffset,
    marginRight: NEU.shadowOffset,
  },
  shadow: {
    position: 'absolute',
    top: NEU.shadowOffset,
    left: NEU.shadowOffset,
    right: -NEU.shadowOffset,
    bottom: -NEU.shadowOffset,
    borderRadius: NEU.radius,
  },
  card: {
    borderWidth: NEU.borderWidth,
    borderRadius: NEU.radius,
    padding: 16,
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  iconBox: {
    borderWidth: NEU.borderWidth,
    borderRadius: NEU.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
