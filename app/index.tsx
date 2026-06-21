import { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONTS, SPACING, RADIUS } from '@/constants/theme';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { GlassPanel } from '@/components/premium/GlassPanel';
import { PremiumButton } from '@/components/premium/PremiumButton';
import { AnimatedCounter } from '@/components/premium/AnimatedCounter';
import { FloatingTrafficElements } from '@/components/premium/FloatingTraffic';
import { FadeIn, StaggerChildren } from '@/components/premium/FadeIn';
import { Shield, Camera, Activity, MapPin, ArrowRight, Sparkles, Radio } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const cardW = (width - 56) / 2;

const STATS = [
  { icon: Camera, label: 'AI Accuracy', value: 99.2, suffix: '%' },
  { icon: Activity, label: 'Violations', value: 12847, suffix: '' },
  { icon: MapPin, label: 'Active Nodes', value: 1240, suffix: '' },
  { icon: Shield, label: 'Recovery Rate', value: 94, suffix: '%' },
];

const FEATURES = [
  { title: 'Neural Detection', desc: 'Real-time violation classification across every camera node.' },
  { title: 'City Mesh Network', desc: 'Synchronized surveillance grid with live vehicle tracking.' },
  { title: 'Command Intelligence', desc: 'Unified dashboard for enforcement and incident response.' },
];

export default function LandingScreen() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace('/tabs');
  }, [user]);

  return (
    <PremiumScreen scroll padHorizontal contentStyle={styles.wrap} noBackground>
      <FloatingTrafficElements />
      <View style={StyleSheet.absoluteFill}>
        <LinearGradient colors={[COLORS.abyss, COLORS.deep, COLORS.abyss]} style={StyleSheet.absoluteFill} />
      </View>

      <FadeIn delay={0}>
        <GlassPanel glow contentStyle={styles.hero}>
          <View style={styles.logoRow}>
            <Shield size={32} color={COLORS.mist} strokeWidth={1.5} />
            <Text style={styles.logo}>AEGIS</Text>
          </View>
          <View style={styles.badge}>
            <Sparkles size={12} color={COLORS.pearl} />
            <Text style={styles.badgeText}>NATIONAL TRAFFIC INTELLIGENCE</Text>
          </View>
          <Text style={styles.heading}>Intelligence That{'\n'}Protects Every Road</Text>
          <Text style={styles.sub}>
            AI-powered surveillance infrastructure for smart cities and national enforcement networks.
          </Text>
          <PremiumButton label="Enter Command Center" icon={ArrowRight} onPress={() => router.push('/auth/login')} />
          <PremiumButton
            label="Explore Platform"
            variant="ghost"
            onPress={() => router.push('/about')}
            small
          />
        </GlassPanel>
      </FadeIn>

      <View style={styles.statsGrid}>
        <StaggerChildren stagger={100} baseDelay={200}>
          {STATS.map((s) => (
            <GlassPanel key={s.label} style={{ width: cardW }} contentStyle={styles.stat}>
              <s.icon size={20} color={COLORS.mist} strokeWidth={1.5} />
              <AnimatedCounter
                value={s.value}
                suffix={s.suffix}
                style={styles.statVal}
                decimals={s.suffix === '%' ? 1 : 0}
              />
              <Text style={styles.statLabel}>{s.label}</Text>
            </GlassPanel>
          ))}
        </StaggerChildren>
      </View>

      <FadeIn delay={500}>
        <Text style={styles.sectionTitle}>Platform Capabilities</Text>
        {FEATURES.map((f) => (
          <GlassPanel key={f.title} style={styles.featureCard} contentStyle={styles.featureInner}>
            <Text style={styles.featureTitle}>{f.title}</Text>
            <Text style={styles.featureDesc}>{f.desc}</Text>
          </GlassPanel>
        ))}
      </FadeIn>

      <FadeIn delay={700}>
        <PremiumButton label="Create Account" variant="outline" onPress={() => router.push('/auth/register')} />
        <Text style={styles.footer}>AEGIS v2.0 · National Traffic Intelligence Network</Text>
      </FadeIn>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: SPACING.lg, paddingBottom: SPACING.xxl },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: SPACING.md,
  },
  hero: { alignItems: 'center', marginBottom: SPACING.lg, gap: SPACING.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    fontFamily: FONTS.display,
    fontSize: 36,
    color: COLORS.pearl,
    letterSpacing: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(119, 141, 169, 0.35)',
    backgroundColor: 'rgba(27, 38, 59, 0.5)',
  },
  badgeText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 10,
    color: COLORS.pearlMuted,
    letterSpacing: 1.5,
  },
  heading: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.pearl,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: 1,
  },
  sub: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.pearlMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  stat: { gap: 6, minHeight: 100 },
  statVal: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: COLORS.pearl,
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.pearlMuted,
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 18,
    color: COLORS.pearl,
    marginBottom: SPACING.md,
    marginTop: SPACING.lg,
  },
  featureCard: { marginBottom: SPACING.sm },
  featureInner: { gap: 6 },
  featureTitle: {
    fontFamily: FONTS.heading,
    fontSize: 15,
    color: COLORS.pearl,
  },
  featureDesc: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.pearlMuted,
    lineHeight: 20,
  },
  footer: {
    textAlign: 'center',
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.pearlSubtle,
    marginTop: SPACING.lg,
  },
});
