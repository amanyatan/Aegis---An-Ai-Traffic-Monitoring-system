import { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { PremiumScreen, SectionTitle } from '@/components/premium/PremiumScreen';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { COLORS, FONTS, SPACING, RADIUS, SEVERITY_COLORS, STATUS_COLORS } from '@/constants/theme';
import { GlassPanel } from '@/components/premium/GlassPanel';
import { AnimatedCounter } from '@/components/premium/AnimatedCounter';
import { FadeIn } from '@/components/premium/FadeIn';
import {
  Bell,
  Camera,
  AlertTriangle,
  Car,
  Activity,
  MapPin,
  Zap,
  Shield,
  Search,
  Radio,
  BarChart3,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const statCardWidth = (width - 48 - CARD_GAP) / 2;

interface DashboardStats {
  totalViolations: number;
  pendingViolations: number;
  activeCameras: number;
  totalVehicles: number;
  missingVehicles: number;
  accidentsToday: number;
  unreadNotifications: number;
}

interface RecentViolation {
  id: string;
  plate_number: string;
  violation_type: string;
  severity: string;
  location: string;
  detected_at: string;
  confidence_score: number;
}

interface RecentAccident {
  id: string;
  location: string;
  severity: string;
  status: string;
  vehicles_involved: number;
  injuries: number;
  reported_at: string;
}

const STAT_CONFIG = [
  { key: 'totalViolations' as const, label: 'Violations', icon: AlertTriangle },
  { key: 'pendingViolations' as const, label: 'Pending', icon: Zap },
  { key: 'activeCameras' as const, label: 'Cameras', icon: Camera },
  { key: 'totalVehicles' as const, label: 'Vehicles', icon: Car },
];

const ACTION_CONFIG = [
  { label: 'Search Vehicle', icon: Search, route: '/tabs/vehicles' as const },
  { label: 'Missing Vehicle', icon: Shield, route: '/missing' as const },
  { label: 'Live Feed', icon: Radio, route: '/tabs/live' as const },
  { label: 'Analytics', icon: BarChart3, route: '/tabs/analytics' as const },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalViolations: 0,
    pendingViolations: 0,
    activeCameras: 0,
    totalVehicles: 0,
    missingVehicles: 0,
    accidentsToday: 0,
    unreadNotifications: 0,
  });
  const [recentViolations, setRecentViolations] = useState<RecentViolation[]>([]);
  const [recentAccidents, setRecentAccidents] = useState<RecentAccident[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const fetchDashboard = useCallback(async () => {
    if (!user) return;
    try {
      const { count: totalViolations } = await supabase
        .from('violations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      const { count: pendingViolations } = await supabase
        .from('violations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'pending');
      const { count: activeCameras } = await supabase
        .from('camera_nodes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'online');
      const { count: totalVehicles } = await supabase
        .from('vehicles')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      const { count: unreadNotifications } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false);

      const { data: violations } = await supabase
        .from('violations')
        .select('id, plate_number, violation_type, severity, location, detected_at, confidence_score')
        .eq('user_id', user.id)
        .order('detected_at', { ascending: false })
        .limit(5);
      const { data: accidents } = await supabase
        .from('accidents')
        .select('id, location, severity, status, vehicles_involved, injuries, reported_at')
        .eq('user_id', user.id)
        .order('reported_at', { ascending: false })
        .limit(3);

      setStats({
        totalViolations: totalViolations ?? 0,
        pendingViolations: pendingViolations ?? 0,
        activeCameras: activeCameras ?? 0,
        totalVehicles: totalVehicles ?? 0,
        missingVehicles: 0,
        accidentsToday: accidents?.length ?? 0,
        unreadNotifications: unreadNotifications ?? 0,
      });
      setRecentViolations(violations || []);
      setRecentAccidents(accidents || []);
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchDashboard();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [fetchDashboard, pulseAnim]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const formatTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const violationTypeLabel = (type: string) =>
    type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <PremiumScreen refreshing={refreshing} onRefresh={onRefresh} padHorizontal contentStyle={styles.content}>
      <FadeIn>
        <GlassPanel glow contentStyle={styles.headerCard}>
          <View style={styles.headerRow}>
            <View style={styles.headerCopy}>
              <View style={styles.liveRow}>
                <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
                <Text style={styles.liveText}>LIVE COMMAND</Text>
              </View>
              <Text style={styles.welcomeText}>Command Center</Text>
              <Text style={styles.nameText}>{profile?.full_name || 'Officer'}</Text>
            </View>
            <TouchableOpacity style={styles.bellButton} onPress={() => router.push('/notification')}>
              <Bell size={22} color={COLORS.pearl} strokeWidth={1.5} />
              {stats.unreadNotifications > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{stats.unreadNotifications}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </GlassPanel>
      </FadeIn>

      <View style={styles.statsGrid}>
        {STAT_CONFIG.map(({ key, label, icon: Icon }, i) => (
          <FadeIn key={key} delay={i * 80}>
            <GlassPanel style={{ width: statCardWidth }} contentStyle={styles.statCard}>
              <Icon size={20} color={COLORS.mist} strokeWidth={1.5} />
              <AnimatedCounter value={stats[key]} style={styles.statNumber} />
              <Text style={styles.statLabel}>{label}</Text>
            </GlassPanel>
          </FadeIn>
        ))}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Recent Violations" actionLabel="See all" onAction={() => router.push('/tabs/violations')} />
        {recentViolations.map((v, i) => {
          const severityColor = SEVERITY_COLORS[v.severity] || COLORS.warning;
          return (
            <FadeIn key={v.id} delay={i * 60}>
              <GlassPanel onPress={() => router.push(`/violation/${v.id}`)} style={styles.listCard} contentStyle={styles.listInner}>
                <View style={styles.listRow}>
                  <View style={styles.listLeft}>
                    <Text style={styles.plateText}>{v.plate_number || 'UNKNOWN'}</Text>
                    <Text style={styles.metaText}>{violationTypeLabel(v.violation_type)}</Text>
                    <View style={styles.metaRow}>
                      <MapPin size={12} color={COLORS.mist} />
                      <Text style={styles.metaText}>{v.location || 'Unknown'}</Text>
                      <Text style={styles.timeText}>{formatTime(v.detected_at)}</Text>
                    </View>
                  </View>
                  <View style={styles.listRight}>
                    <View style={[styles.chip, { borderColor: severityColor }]}>
                      <Text style={[styles.chipText, { color: severityColor }]}>{v.severity}</Text>
                    </View>
                    <Text style={styles.confidenceText}>{v.confidence_score?.toFixed(0)}%</Text>
                  </View>
                </View>
              </GlassPanel>
            </FadeIn>
          );
        })}
        {recentViolations.length === 0 && (
          <GlassPanel contentStyle={styles.emptyInner}>
            <AlertTriangle size={28} color={COLORS.mist} strokeWidth={1.5} />
            <Text style={styles.emptyText}>No recent violations</Text>
          </GlassPanel>
        )}
      </View>

      <View style={styles.section}>
        <SectionTitle title="Active Accidents" actionLabel="See all" onAction={() => router.push('/accident')} />
        {recentAccidents.map((a, i) => {
          const severityColor = SEVERITY_COLORS[a.severity] || COLORS.danger;
          return (
            <FadeIn key={a.id} delay={i * 60}>
              <GlassPanel onPress={() => router.push(`/accident/${a.id}`)} style={styles.listCard} contentStyle={styles.listInner}>
                <View style={styles.listRow}>
                  <View style={styles.listLeft}>
                    <Text style={styles.plateText}>{a.location || 'Unknown'}</Text>
                    <View style={styles.metaRow}>
                      <Text style={styles.metaText}>{a.vehicles_involved} vehicles</Text>
                      <Text style={styles.metaText}>{a.injuries} injuries</Text>
                      <Text style={styles.timeText}>{formatTime(a.reported_at)}</Text>
                    </View>
                  </View>
                  <View style={[styles.chip, { borderColor: severityColor }]}>
                    <Text style={[styles.chipText, { color: severityColor }]}>{a.severity}</Text>
                  </View>
                </View>
              </GlassPanel>
            </FadeIn>
          );
        })}
        {recentAccidents.length === 0 && (
          <GlassPanel contentStyle={styles.emptyInner}>
            <Activity size={28} color={COLORS.mist} strokeWidth={1.5} />
            <Text style={styles.emptyText}>No active accidents</Text>
          </GlassPanel>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          {ACTION_CONFIG.map(({ label, icon: Icon, route }, i) => (
            <FadeIn key={label} delay={i * 60}>
              <GlassPanel onPress={() => router.push(route)} style={{ width: statCardWidth }} contentStyle={styles.actionInner}>
                <Icon size={24} color={COLORS.mist} strokeWidth={1.5} />
                <Text style={styles.actionText}>{label}</Text>
              </GlassPanel>
            </FadeIn>
          ))}
        </View>
      </View>

      <View style={{ height: 28 }} />
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: SPACING.sm, paddingBottom: SPACING.md },
  headerCard: { marginBottom: SPACING.lg },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerCopy: { flex: 1 },
  liveRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
  },
  liveText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 10,
    letterSpacing: 2,
    color: COLORS.success,
  },
  welcomeText: {
    fontFamily: FONTS.body,
    fontSize: 12,
    color: COLORS.pearlMuted,
    letterSpacing: 1,
  },
  nameText: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: COLORS.pearl,
    letterSpacing: 1,
    marginTop: 4,
  },
  bellButton: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(119, 141, 169, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(13, 27, 42, 0.5)',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontFamily: FONTS.bodyBold, fontSize: 10, color: COLORS.pearl },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: SPACING.lg,
  },
  statCard: { minHeight: 110, gap: 8 },
  statNumber: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.pearl,
    letterSpacing: -1,
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.pearlMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  section: { marginBottom: SPACING.lg },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.pearl,
    marginBottom: SPACING.md,
  },
  listCard: { marginBottom: CARD_GAP },
  listInner: { paddingVertical: 14 },
  listRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  listLeft: { flex: 1, paddingRight: 12 },
  listRight: { alignItems: 'flex-end', gap: 8 },
  plateText: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.pearl,
    letterSpacing: 0.5,
  },
  metaText: { fontFamily: FONTS.body, fontSize: 12, color: COLORS.pearlMuted, marginTop: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  timeText: { fontFamily: FONTS.bodySemi, fontSize: 11, color: COLORS.mist },
  chip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  confidenceText: { fontFamily: FONTS.body, fontSize: 11, color: COLORS.pearlMuted },
  emptyInner: { alignItems: 'center', gap: 10, paddingVertical: 28 },
  emptyText: { fontFamily: FONTS.bodySemi, fontSize: 14, color: COLORS.pearlMuted },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP },
  actionInner: {
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  actionText: {
    fontFamily: FONTS.bodySemi,
    fontSize: 12,
    color: COLORS.pearlMuted,
    textAlign: 'center',
  },
});
