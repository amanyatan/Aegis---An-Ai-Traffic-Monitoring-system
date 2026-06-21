import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { GlassPanel } from '@/components/premium/GlassPanel';
import { PremiumButton } from '@/components/premium/PremiumButton';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { MapPinOff } from 'lucide-react-native';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <PremiumScreen padHorizontal contentStyle={styles.wrap}>
      <GlassPanel glow contentStyle={styles.card}>
        <MapPinOff size={48} color={COLORS.mist} strokeWidth={1.5} />
        <Text style={styles.title}>Route Not Found</Text>
        <Text style={styles.sub}>This sector of the network is unavailable.</Text>
        <PremiumButton label="Return to Home" onPress={() => router.replace('/')} />
      </GlassPanel>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', paddingVertical: SPACING.xxl },
  card: { alignItems: 'center', gap: SPACING.md },
  title: { fontFamily: FONTS.display, fontSize: 24, color: COLORS.pearl, letterSpacing: 2 },
  sub: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.pearlMuted, textAlign: 'center' },
});
