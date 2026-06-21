import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { AegisBackground } from '@/components/premium/AegisBackground';
import { ScrollProgress } from '@/components/premium/ScrollProgress';
import { Reveal } from '@/components/premium/Reveal.web';
import { MagneticButtonWeb } from '@/components/premium/MagneticButton.web';
import { AnimatedCounter } from '@/components/premium/AnimatedCounter';
import { CSSProperties } from 'react';
import { Text, View, TextStyle } from 'react-native';
import { Shield, Camera, Activity, MapPin, ArrowRight, Sparkles, Radio, ScanEye, Satellite } from 'lucide-react-native';

const STATS = [
  { icon: Camera, label: 'AI Accuracy', value: 99.2, suffix: '%' },
  { icon: Activity, label: 'Monthly Violations', value: 12847, suffix: '' },
  { icon: MapPin, label: 'Active Nodes', value: 1240, suffix: '' },
  { icon: Shield, label: 'Recovery Rate', value: 94, suffix: '%' },
];

const FEATURES = [
  {
    title: 'Neural Detection',
    desc: 'Deep learning models classify violations in real time across every camera feed.',
    icon: ScanEye,
  },
  {
    title: 'City Mesh Network',
    desc: 'Synchronized surveillance grid with vehicle tracking and incident correlation.',
    icon: Radio,
  },
  {
    title: 'Satellite Intelligence',
    desc: 'Multi-source fusion from CCTV, ANPR, drones, and orbital monitoring nodes.',
    icon: Satellite,
  },
];

export default function LandingScreenWeb() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) router.replace('/tabs');
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', background: COLORS.abyss, color: COLORS.pearl }}>
      <ScrollProgress />
      <AegisBackground />
      <FloatingIcons />

      {/* Hero */}
      <section style={styles.heroSection as object}>
        <div className="aegis-hero-glow" style={{ top: '-10%', left: '20%' }} />
        <div className="aegis-scan-line" />
        <Reveal>
          <div style={{ textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
            <div style={styles.logoRow as object}>
              <Shield size={40} color={COLORS.mist} strokeWidth={1.5} />
              <span style={styles.logo as object}>AEGIS</span>
            </div>
            <div style={styles.badge as object}>
              <Sparkles size={14} color={COLORS.pearl} />
              <span>NATIONAL TRAFFIC INTELLIGENCE</span>
            </div>
            <h1 style={styles.heroTitle as object}>
              Intelligence That
              <br />
              <span style={{ color: COLORS.mist }}>Protects Every Road</span>
            </h1>
            <p style={styles.heroSub as object}>
              AI-powered traffic intelligence for smart cities. Real-time detection, unified command,
              and national-scale enforcement infrastructure.
            </p>
            <div style={styles.ctaRow as object}>
              <MagneticButtonWeb onClick={() => router.push('/auth/login')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  Enter Command Center <ArrowRight size={16} color={COLORS.pearl} />
                </span>
              </MagneticButtonWeb>
              <MagneticButtonWeb variant="ghost" onClick={() => router.push('/about')}>
                Explore Platform
              </MagneticButtonWeb>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div style={styles.statsRow as object}>
            {STATS.map((s) => (
              <div key={s.label} className="aegis-glass aegis-feature-tilt" style={styles.statCard as object}>
                <s.icon size={22} color={COLORS.mist} strokeWidth={1.5} />
                <AnimatedCounter
                  value={s.value}
                  suffix={s.suffix}
                  style={styles.statVal as TextStyle}
                  decimals={s.suffix === '%' ? 1 : 0}
                />
                <Text style={{ fontFamily: FONTS.body, fontSize: 12, color: COLORS.pearlMuted }}>{s.label}</Text>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Features */}
      <section style={styles.section as object}>
        <Reveal>
          <h2 style={styles.sectionTitle as object}>Platform Capabilities</h2>
          <p style={styles.sectionSub as object}>
            Built for national-scale traffic intelligence — not template dashboards.
          </p>
        </Reveal>
        <div style={styles.featureGrid as object}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.1}>
              <div className="aegis-glass aegis-glass-glow aegis-feature-tilt" style={styles.featureCard as object}>
                <f.icon size={28} color={COLORS.mist} strokeWidth={1.5} />
                <h3 style={styles.featureTitle as object}>{f.title}</h3>
                <p style={styles.featureDesc as object}>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection as object}>
        <Reveal>
          <div className="aegis-glass aegis-glass-glow" style={styles.ctaPanel as object}>
            <h2 style={styles.ctaTitle as object}>Ready to deploy intelligence?</h2>
            <p style={styles.ctaSub as object}>Join the national traffic monitoring network.</p>
            <MagneticButtonWeb onClick={() => router.push('/auth/register')}>
              Create Command Account
            </MagneticButtonWeb>
          </div>
        </Reveal>
        <p style={styles.footer as object}>AEGIS v2.0 · National Traffic Intelligence Network</p>
      </section>
    </div>
  );
}

function FloatingIcons() {
  const icons = ['🚗', '🏍', '🚦', '📡', '🛰', '⚠'];
  return (
    <>
      {icons.map((icon, i) => (
        <div
          key={i}
          className="aegis-particle"
          style={{
            position: 'fixed',
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            fontSize: 24,
            opacity: 0.08,
            animationDuration: `${10 + i * 2}s`,
            animationDelay: `${i * 0.8}s`,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {icon}
        </div>
      ))}
    </>
  );
}

const styles: Record<string, CSSProperties> = {
  heroSection: {
    minHeight: 100,
    paddingTop: 120,
    paddingBottom: 80,
    paddingLeft: 48,
    paddingRight: 48,
    position: 'relative',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 24,
  },
  logo: {
    fontFamily: FONTS.display,
    fontSize: 48,
    letterSpacing: 12,
    color: COLORS.pearl,
  },
  badge: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 999,
    border: '1px solid rgba(119, 141, 169, 0.35)',
    backgroundColor: 'rgba(27, 38, 59, 0.5)',
    fontFamily: FONTS.bodySemi,
    fontSize: 11,
    letterSpacing: 2,
    color: COLORS.pearlMuted,
    marginBottom: 32,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  heroTitle: {
    fontFamily: FONTS.display,
    fontSize: 56,
    lineHeight: 64,
    letterSpacing: 2,
    color: COLORS.pearl,
    marginBottom: 24,
  },
  heroSub: {
    fontFamily: FONTS.body,
    fontSize: 18,
    lineHeight: 28,
    color: COLORS.pearlMuted,
    maxWidth: 640,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 40,
  },
  ctaRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  statsRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    justifyContent: 'center',
    marginTop: 64,
    flexWrap: 'wrap',
  },
  statCard: {
    padding: 24,
    minWidth: 180,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    alignItems: 'center',
  },
  statVal: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.pearl,
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.pearlMuted,
  },
  section: {
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 48,
    paddingRight: 48,
    maxWidth: 1200,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: 36,
    color: COLORS.pearl,
    marginBottom: 12,
  },
  sectionSub: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.pearlMuted,
    marginBottom: 48,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
  },
  featureCard: {
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  featureTitle: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    color: COLORS.pearl,
  },
  featureDesc: {
    fontFamily: FONTS.body,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.pearlMuted,
  },
  ctaSection: {
    paddingTop: 80,
    paddingBottom: 80,
    paddingLeft: 48,
    paddingRight: 48,
    textAlign: 'center',
  },
  ctaPanel: {
    padding: 48,
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    alignItems: 'center',
  },
  ctaTitle: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.pearl,
  },
  ctaSub: {
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.pearlMuted,
    marginBottom: 8,
  },
  footer: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.pearlSubtle,
  },
};
