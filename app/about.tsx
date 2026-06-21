import { useRouter } from 'expo-router';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { GlassPanel } from '@/components/premium/GlassPanel';
import { PremiumButton } from '@/components/premium/PremiumButton';
import { FadeIn } from '@/components/premium/FadeIn';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { ArrowLeft, Shield } from 'lucide-react-native';

const MILESTONES = [
  { year: '2024', title: 'Platform Genesis', desc: 'AEGIS neural detection core deployed in pilot cities.' },
  { year: '2025', title: 'National Mesh', desc: '1,240 camera nodes synchronized across enforcement districts.' },
  { year: '2026', title: 'Intelligence Layer', desc: 'Real-time violation classification at 99.2% accuracy.' },
];

export default function AboutScreen() {
  const router = useRouter();

  return (
    <PremiumScreen scroll padHorizontal contentStyle={styles.wrap}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={22} color={COLORS.pearl} strokeWidth={1.5} />
      </TouchableOpacity>

      <FadeIn>
        <View style={styles.hero}>
          <Shield size={36} color={COLORS.mist} strokeWidth={1.5} />
          <Text style={styles.title}>The AEGIS Story</Text>
          <Text style={styles.sub}>
            A national-scale AI traffic intelligence platform built for smart cities and enforcement command centers.
          </Text>
        </View>
      </FadeIn>

      {MILESTONES.map((m, i) => (
        <FadeIn key={m.year} delay={i * 120}>
          <GlassPanel glow={i === MILESTONES.length - 1} style={styles.milestone} contentStyle={styles.milestoneInner}>
            <Text style={styles.year}>{m.year}</Text>
            <Text style={styles.milestoneTitle}>{m.title}</Text>
            <Text style={styles.milestoneDesc}>{m.desc}</Text>
          </GlassPanel>
        </FadeIn>
      ))}

      <FadeIn delay={400}>
        <PremiumButton label="Enter Dashboard" onPress={() => router.push('/auth/login')} />
      </FadeIn>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: SPACING.xxl },
  back: { marginBottom: SPACING.md },
  hero: { alignItems: 'center', marginBottom: SPACING.xl, gap: SPACING.md },
  title: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.pearl,
    letterSpacing: 2,
    textAlign: 'center',
  },
  sub: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.pearlMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 340,
  },
  milestone: { marginBottom: SPACING.md },
  milestoneInner: { gap: 8 },
  year: {
    fontFamily: FONTS.display,
    fontSize: 14,
    color: COLORS.mist,
    letterSpacing: 2,
  },
  milestoneTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.pearl,
  },
  milestoneDesc: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.pearlMuted,
    lineHeight: 22,
  },
});
