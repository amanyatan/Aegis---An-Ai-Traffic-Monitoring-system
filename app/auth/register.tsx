import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { COLORS, FONTS, SPACING } from '@/constants/theme';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { GlassPanel } from '@/components/premium/GlassPanel';
import { PremiumButton } from '@/components/premium/PremiumButton';
import { FadeIn } from '@/components/premium/FadeIn';
import { ArrowLeft, Eye, EyeOff, Shield, AlertCircle, CheckCircle } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  const handleRegister = async () => {
    if (!email || !password || !fullName) { setError('Please fill in all fields'); shake(); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); shake(); return; }
    setLoading(true);
    setError('');
    const { error: signUpError } = await signUp(email, password, fullName);
    if (signUpError) { setError(signUpError.message || 'Registration failed'); shake(); }
    else setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <PremiumScreen padHorizontal contentStyle={styles.successWrap}>
        <GlassPanel glow contentStyle={styles.successCard}>
          <CheckCircle size={56} color={COLORS.success} strokeWidth={1.5} />
          <Text style={styles.successTitle}>Account Created</Text>
          <Text style={styles.successText}>You can now sign in to AEGIS.</Text>
          <PremiumButton label="Go to Sign In" onPress={() => router.push('/auth/login')} />
        </GlassPanel>
      </PremiumScreen>
    );
  }

  return (
    <PremiumScreen keyboardAvoiding padHorizontal scroll contentStyle={styles.wrap}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <ArrowLeft size={22} color={COLORS.pearl} strokeWidth={1.5} />
      </TouchableOpacity>
      <View style={styles.logoRow}>
        <Shield size={28} color={COLORS.mist} strokeWidth={1.5} />
        <Text style={styles.logoText}>AEGIS</Text>
      </View>

      <GlassPanel glow contentStyle={styles.hero}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join the national intelligence network</Text>
      </GlassPanel>

      <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
        {error ? (
          <GlassPanel style={styles.errorBox} contentStyle={styles.errorInner}>
            <AlertCircle size={16} color={COLORS.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </GlassPanel>
        ) : null}

        <Text style={styles.label}>FULL NAME</Text>
        <GlassPanel contentStyle={styles.inputWrap}>
          <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="John Smith" placeholderTextColor={COLORS.pearlSubtle} editable={!loading} />
        </GlassPanel>

        <Text style={styles.label}>EMAIL</Text>
        <GlassPanel contentStyle={styles.inputWrap}>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="officer@aegis.gov" placeholderTextColor={COLORS.pearlSubtle} editable={!loading} />
        </GlassPanel>

        <Text style={styles.label}>PASSWORD</Text>
        <GlassPanel contentStyle={styles.passwordRow}>
          <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry={!showPassword} placeholder="Min 6 characters" placeholderTextColor={COLORS.pearlSubtle} editable={!loading} />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} color={COLORS.mist} /> : <Eye size={18} color={COLORS.mist} />}
          </TouchableOpacity>
        </GlassPanel>

        <PremiumButton label={loading ? 'Creating...' : 'Create Account'} onPress={handleRegister} loading={loading} />
      </Animated.View>

      <TouchableOpacity onPress={() => router.push('/auth/login')} style={styles.link}>
        <Text style={styles.linkText}>Have an account? <Text style={styles.linkBold}>Sign in</Text></Text>
      </TouchableOpacity>
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingBottom: 40 },
  back: { marginBottom: SPACING.md },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: SPACING.lg },
  logoText: { fontFamily: FONTS.display, fontSize: 22, letterSpacing: 4, color: COLORS.pearl },
  hero: { marginBottom: SPACING.lg, gap: 6 },
  title: { fontFamily: FONTS.display, fontSize: 26, color: COLORS.pearl, letterSpacing: 1 },
  subtitle: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.pearlMuted },
  successWrap: { flex: 1, justifyContent: 'center' },
  successCard: { alignItems: 'center', gap: 16 },
  successTitle: { fontFamily: FONTS.display, fontSize: 24, color: COLORS.pearl },
  successText: { fontFamily: FONTS.body, fontSize: 14, color: COLORS.pearlMuted },
  errorBox: { marginBottom: SPACING.md, borderColor: COLORS.danger },
  errorInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  errorText: { fontFamily: FONTS.bodySemi, fontSize: 13, color: COLORS.danger, flex: 1 },
  label: { fontFamily: FONTS.bodySemi, fontSize: 11, letterSpacing: 1.5, color: COLORS.pearlMuted, marginBottom: 8, marginTop: 4 },
  inputWrap: { marginBottom: SPACING.md, paddingVertical: 4 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.lg, paddingVertical: 4 },
  input: { flex: 1, fontFamily: FONTS.body, fontSize: 15, color: COLORS.pearl, paddingVertical: 12 },
  link: { marginTop: SPACING.lg, alignItems: 'center' },
  linkText: { fontFamily: FONTS.body, fontSize: 13, color: COLORS.pearlMuted },
  linkBold: { fontFamily: FONTS.bodySemi, color: COLORS.pearl },
});
