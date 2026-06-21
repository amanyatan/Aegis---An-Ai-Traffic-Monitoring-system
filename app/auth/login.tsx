import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONTS, RADIUS, SPACING } from '@/constants/theme';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { GlassPanel } from '@/components/premium/GlassPanel';
import { PremiumButton } from '@/components/premium/PremiumButton';
import { FadeIn } from '@/components/premium/FadeIn';
import { ArrowLeft, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('demo@aegis.gov');
  const [password, setPassword] = useState('aegis2024');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      shake();
      return;
    }
    setLoading(true);
    setError('');
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError.message || 'Invalid credentials');
      shake();
    } else {
      router.replace('/tabs');
    }
    setLoading(false);
  };

  return (
    <PremiumScreen keyboardAvoiding padHorizontal scroll contentStyle={styles.wrap}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={22} color={COLORS.pearl} strokeWidth={1.5} />
      </TouchableOpacity>

      <FadeIn>
        <View style={styles.logoRow}>
          <Shield size={28} color={COLORS.mist} strokeWidth={1.5} />
          <Text style={styles.logoText}>AEGIS</Text>
        </View>
      </FadeIn>

      <FadeIn delay={100}>
        <GlassPanel glow contentStyle={styles.hero}>
          <Text style={styles.title}>Secure Access</Text>
          <Text style={styles.subtitle}>Authenticate to your command dashboard</Text>
        </GlassPanel>
      </FadeIn>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        {error ? (
          <GlassPanel style={styles.errorBox} contentStyle={styles.errorInner}>
            <AlertCircle size={16} color={COLORS.danger} strokeWidth={1.5} />
            <Text style={styles.errorText}>{error}</Text>
          </GlassPanel>
        ) : null}

        <FadeIn delay={200}>
          <Text style={styles.label}>EMAIL</Text>
          <GlassPanel contentStyle={styles.inputWrap}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={COLORS.pearlSubtle}
              placeholder="officer@aegis.gov"
              editable={!loading}
            />
          </GlassPanel>

          <Text style={styles.label}>PASSWORD</Text>
          <GlassPanel contentStyle={styles.passwordRow}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor={COLORS.pearlSubtle}
              placeholder="Enter password"
              editable={!loading}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={18} color={COLORS.mist} />
              ) : (
                <Eye size={18} color={COLORS.mist} />
              )}
            </TouchableOpacity>
          </GlassPanel>

          <PremiumButton
            label={loading ? 'Authenticating...' : 'Sign In'}
            onPress={handleLogin}
            loading={loading}
          />
        </FadeIn>
      </Animated.View>

      <TouchableOpacity onPress={() => router.push('/auth/register')} style={styles.link}>
        <Text style={styles.linkText}>
          No account? <Text style={styles.linkBold}>Create one</Text>
        </Text>
      </TouchableOpacity>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: 40 },
  back: { marginBottom: SPACING.md, alignSelf: 'flex-start' },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: SPACING.lg },
  logoText: {
    fontFamily: FONTS.display,
    fontSize: 22,
    letterSpacing: 4,
    color: COLORS.pearl,
  },
  hero: { marginBottom: SPACING.lg, gap: 6 },
  title: {
    fontFamily: FONTS.display,
    fontSize: 26,
    color: COLORS.pearl,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: FONTS.body,
    fontSize: 14,
    color: COLORS.pearlMuted,
  },
  errorBox: { marginBottom: SPACING.md, borderColor: COLORS.danger },
  errorInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  errorText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 13,
    color: COLORS.danger,
    flex: 1,
  },
  label: {
    fontFamily: FONTS.bodySemi,
    fontSize: 11,
    letterSpacing: 1.5,
    color: COLORS.pearlMuted,
    marginBottom: 8,
  },
  inputWrap: { marginBottom: SPACING.md, paddingVertical: 4 },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.body,
    fontSize: 15,
    color: COLORS.pearl,
    paddingVertical: 12,
  },
  link: { marginTop: SPACING.lg, alignItems: 'center' },
  linkText: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.pearlMuted },
  linkBold: { fontFamily: FONTS.bodySemi, color: COLORS.pearl },
});
