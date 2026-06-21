import { ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { COLORS, FONTS, RADIUS } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

type PremiumButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: 'primary' | 'ghost' | 'outline';
  icon?: LucideIcon;
  loading?: boolean;
  small?: boolean;
};

export function PremiumButton({
  label,
  onPress,
  variant = 'primary',
  icon: Icon,
  loading,
  small,
}: PremiumButtonProps) {
  if (variant === 'primary') {
    return (
      <TouchableOpacity onPress={onPress} disabled={loading} activeOpacity={0.85}>
        <LinearGradient
          colors={[COLORS.slate, COLORS.mist]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.primary, small && styles.small]}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.pearl} />
          ) : (
            <View style={styles.row}>
              {Icon ? <Icon size={18} color={COLORS.pearl} strokeWidth={2} /> : null}
              <Text style={[styles.primaryText, small && styles.smallText]}>{label}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
      style={[
        styles.outline,
        variant === 'ghost' && styles.ghost,
        small && styles.small,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.pearl} />
      ) : (
        <View style={styles.row}>
          {Icon ? <Icon size={18} color={COLORS.pearl} strokeWidth={2} /> : null}
          <Text style={[styles.outlineText, small && styles.smallText]}>{label}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primary: {
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(224, 225, 221, 0.15)',
  },
  small: { paddingVertical: 12, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  primaryText: {
    fontFamily: FONTS.heading,
    fontSize: 14,
    color: COLORS.pearl,
    letterSpacing: 1,
  },
  smallText: { fontSize: 12 },
  outline: {
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(119, 141, 169, 0.35)',
    backgroundColor: 'rgba(27, 38, 59, 0.4)',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(119, 141, 169, 0.2)',
  },
  outlineText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.pearl,
  },
});
