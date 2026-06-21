import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONTS } from '@/constants/theme';
import { AegisBackground } from '@/components/premium/AegisBackground';
import { ScrollProgress } from '@/components/premium/ScrollProgress';
import { MagneticButtonWeb } from '@/components/premium/MagneticButton.web';
import { Reveal } from '@/components/premium/Reveal.web';
import { CSSProperties } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, ScanEye, Radio, Lock } from 'lucide-react-native';

export default function LoginScreenWeb() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('demo@aegis.gov');
  const [password, setPassword] = useState('aegis2024');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    setError('');
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message || 'Invalid credentials');
    } else {
      router.replace('/tabs');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.abyss }}>
      <ScrollProgress />
      <AegisBackground />
      <div className="aegis-split-auth">
        <div className="aegis-split-left">
          <div className="aegis-hero-glow" style={{ position: 'absolute', top: '20%', left: '10%' }} />
          <Reveal>
            <div style={{ textAlign: 'center', padding: 48, zIndex: 2 }}>
              <Shield size={64} color={COLORS.mist} strokeWidth={1} />
              <h1 style={styles.illusTitle as object}>AEGIS</h1>
              <p style={styles.illusSub as object}>National Traffic Intelligence Network</p>
              <div style={styles.illusFeatures as object}>
                <div style={styles.illusFeature as object}>
                  <ScanEye size={20} color={COLORS.mist} />
                  <span>Neural Detection</span>
                </div>
                <div style={styles.illusFeature as object}>
                  <Radio size={20} color={COLORS.mist} />
                  <span>Live Mesh Network</span>
                </div>
                <div style={styles.illusFeature as object}>
                  <Lock size={20} color={COLORS.mist} />
                  <span>Secure Command Access</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="aegis-split-right">
          <Reveal delay={0.15}>
            <div className="aegis-glass aegis-glass-glow" style={styles.card as object}>
              <h2 style={styles.title as object}>Welcome back</h2>
              <p style={styles.subtitle as object}>Sign in to your command dashboard</p>

              {error ? (
                <div style={styles.errorBox as object}>
                  <AlertCircle size={16} color={COLORS.danger} />
                  <span>{error}</span>
                </div>
              ) : null}

              <label style={styles.label as object}>Email</label>
              <input
                style={styles.input as object}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer@aegis.gov"
                type="email"
                disabled={loading}
              />

              <label style={styles.label as object}>Password</label>
              <div style={styles.passwordRow as object}>
                <input
                  style={styles.input as object}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn as object}
                >
                  {showPassword ? (
                    <EyeOff size={18} color={COLORS.mist} />
                  ) : (
                    <Eye size={18} color={COLORS.mist} />
                  )}
                </button>
              </div>

              <MagneticButtonWeb onClick={handleLogin} disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </MagneticButtonWeb>

              <button
                type="button"
                onClick={() => router.push('/auth/register')}
                style={styles.linkBtn as object}
              >
                No account? <strong>Create one</strong>
              </button>

              <div style={styles.socialRow as object}>
                <button type="button" className="aegis-glass" style={styles.socialBtn as object}>
                  Google
                </button>
                <button type="button" className="aegis-glass" style={styles.socialBtn as object}>
                  SSO
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    width: '100%',
    maxWidth: 420,
    padding: 40,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.pearl,
    letterSpacing: 1,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.pearlMuted,
    marginBottom: 24,
  },
  errorBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    border: `1px solid ${COLORS.danger}`,
    backgroundColor: 'rgba(224, 122, 95, 0.1)',
    color: COLORS.danger,
    fontFamily: FONTS.body,
    fontSize: 13,
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.bodySemi,
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.pearlMuted,
    marginTop: 12,
    marginBottom: 8,
    display: 'block',
  },
  input: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    border: '1px solid rgba(119, 141, 169, 0.25)',
    backgroundColor: 'rgba(13, 27, 42, 0.6)',
    color: COLORS.pearl,
    fontFamily: FONTS.body,
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
  },
  passwordRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  eyeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
  },
  linkBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.pearlMuted,
    marginTop: 20,
    textAlign: 'center',
  },
  socialRow: {
    display: 'flex',
    gap: 12,
    marginTop: 24,
  },
  socialBtn: {
    flex: 1,
    padding: 12,
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.pearlMuted,
    cursor: 'pointer',
    border: 'none',
    borderRadius: 10,
  },
  illusTitle: {
    fontFamily: FONTS.display,
    fontSize: 48,
    letterSpacing: 12,
    color: COLORS.pearl,
    marginTop: 24,
  },
  illusSub: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.pearlMuted,
    marginTop: 8,
  },
  illusFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    marginTop: 40,
    alignItems: 'flex-start',
  },
  illusFeature: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.pearlMuted,
  },
};
