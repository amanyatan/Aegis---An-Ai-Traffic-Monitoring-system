import { useRouter } from 'expo-router';
import { COLORS, FONTS } from '@/constants/theme';
import { AegisBackground } from '@/components/premium/AegisBackground';
import { ScrollProgress } from '@/components/premium/ScrollProgress';
import { Reveal } from '@/components/premium/Reveal.web';
import { MagneticButtonWeb } from '@/components/premium/MagneticButton.web';
import { CSSProperties } from 'react';
import { Shield, ArrowLeft } from 'lucide-react-native';

const MILESTONES = [
  {
    year: '2024',
    title: 'Platform Genesis',
    desc: 'Neural detection core deployed across pilot enforcement districts.',
  },
  {
    year: '2025',
    title: 'National Mesh Network',
    desc: '1,240 synchronized camera nodes with real-time vehicle correlation.',
  },
  {
    year: '2026',
    title: 'Intelligence Command',
    desc: 'Unified dashboard with 99.2% detection accuracy and live violation feeds.',
  },
  {
    year: 'Future',
    title: 'Autonomous Response',
    desc: 'Predictive incident modeling and automated enforcement workflows.',
  },
];

const PIPELINE = [
  'Capture',
  'OCR / ANPR',
  'Neural Classify',
  'Violation Match',
  'Command Alert',
];

export default function AboutScreenWeb() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: COLORS.abyss, color: COLORS.pearl }}>
      <ScrollProgress />
      <AegisBackground />

      <section style={styles.hero as object}>
        <button type="button" onClick={() => router.back()} style={styles.backBtn as object}>
          <ArrowLeft size={18} color={COLORS.pearl} /> Back
        </button>
        <Reveal>
          <div style={{ textAlign: 'center', paddingTop: 80 }}>
            <Shield size={48} color={COLORS.mist} strokeWidth={1} />
            <h1 style={styles.title as object}>The AEGIS Story</h1>
            <p style={styles.sub as object}>
              Product launch narrative for national traffic intelligence infrastructure.
            </p>
          </div>
        </Reveal>
      </section>

      <section style={styles.pipelineSection as object}>
        <Reveal>
          <h2 style={styles.sectionTitle as object}>AI Processing Pipeline</h2>
        </Reveal>
        <div style={styles.pipeline as object}>
          {PIPELINE.map((step, i) => (
            <Reveal key={step} delay={i * 0.08}>
              <div className="aegis-glass" style={styles.pipelineStep as object}>
                <span style={styles.stepNum as object}>{i + 1}</span>
                <span style={styles.stepLabel as object}>{step}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section>
        <Reveal>
          <h2 style={styles.sectionTitle as object}>Milestones</h2>
          <p style={styles.sectionSub as object}>Scroll horizontally through our evolution</p>
        </Reveal>
        <div className="aegis-horizontal-scroll" style={{ padding: '32px 48px 64px' }}>
          {MILESTONES.map((m, i) => (
            <Reveal key={m.year} delay={i * 0.1}>
              <div
                className="aegis-glass aegis-glass-glow aegis-feature-tilt about-milestone"
                style={styles.milestoneCard as object}
              >
                <span style={styles.year as object}>{m.year}</span>
                <h3 style={styles.milestoneTitle as object}>{m.title}</h3>
                <p style={styles.milestoneDesc as object}>{m.desc}</p>
                <div style={styles.cardIndex as object}>{String(i + 1).padStart(2, '0')}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={styles.ctaSection as object}>
        <MagneticButtonWeb onClick={() => router.push('/auth/login')}>
          Enter Command Center
        </MagneticButtonWeb>
      </section>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  hero: { padding: 48, position: 'relative' },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: 'none',
    color: COLORS.pearl,
    fontFamily: FONTS.body,
    fontSize: 14,
    cursor: 'pointer',
    position: 'absolute',
    top: 32,
    left: 32,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 42,
    letterSpacing: 4,
    color: COLORS.pearl,
    marginTop: 24,
  },
  sub: {
    fontFamily: FONTS.body,
    fontSize: 16,
    color: COLORS.pearlMuted,
    maxWidth: 560,
    margin: '16px auto 0',
    lineHeight: 26,
  },
  pipelineSection: {
    padding: '64px 48px',
    maxWidth: 1000,
    margin: '0 auto',
  },
  sectionTitle: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.pearl,
    marginBottom: 8,
  },
  sectionSub: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.pearlMuted,
    marginBottom: 32,
  },
  pipeline: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  pipelineStep: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 24px',
  },
  stepNum: {
    fontFamily: FONTS.display,
    fontSize: 14,
    color: COLORS.mist,
  },
  stepLabel: {
    fontFamily: FONTS.bodySemi,
    fontSize: 14,
    color: COLORS.pearl,
  },
  horizontalWrap: {
    height: '70vh',
    overflow: 'hidden',
  },
  horizontalTrack: {
    display: 'flex',
    gap: 32,
    padding: '48px 80px',
    height: '100%',
    alignItems: 'center',
  },
  milestoneCard: {
    width: 360,
    minHeight: 280,
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    position: 'relative',
  },
  year: {
    fontFamily: FONTS.display,
    fontSize: 14,
    letterSpacing: 3,
    color: COLORS.mist,
  },
  milestoneTitle: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.pearl,
  },
  milestoneDesc: {
    fontFamily: FONTS.body,
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.pearlMuted,
  },
  cardIndex: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    fontFamily: FONTS.display,
    fontSize: 48,
    color: 'rgba(119, 141, 169, 0.15)',
  },
  ctaSection: {
    padding: 80,
    textAlign: 'center',
  },
};
