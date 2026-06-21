import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, RefreshControl, Dimensions } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE, SEVERITY_NEU, STATUS_NEU, iconColorForFill , COLORS } from '@/constants/neubrutalism';
import { BarChart3, Activity, Camera, Upload, DollarSign, Calendar, ChevronDown } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ViolationStat {
  violation_type: string;
  count: number;
}

interface SeverityStat {
  severity: string;
  count: number;
}

interface MonthlyStat {
  month: string;
  count: number;
}

interface DetectionResult {
  id: string;
  plate_number: string;
  violation_types: string[];
  charges: number;
  confidence_score: number;
  created_at: string;
}

interface CameraStat {
  id: string;
  name: string;
  status: string;
  camera_type: string;
}

const PERIODS = ['Today', 'Week', 'Month', 'Year'];

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const [period, setPeriod] = useState('Today');
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);
  const [violationStats, setViolationStats] = useState<ViolationStat[]>([]);
  const [severityStats, setSeverityStats] = useState<SeverityStat[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [detectionStats, setDetectionStats] = useState<DetectionResult[]>([]);
  const [cameraStats, setCameraStats] = useState<CameraStat[]>([]);
  const [totalViolations, setTotalViolations] = useState(0);
  const [totalDetections, setTotalDetections] = useState(0);
  const [avgConfidence, setAvgConfidence] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [activeCameras, setActiveCameras] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchAnalytics = useCallback(async () => {
    if (!user) return;
    const [violationsRes, detectionsRes, camerasRes] = await Promise.all([
      supabase.from('violations').select('violation_type, severity, confidence_score, fine_amount, detected_at').eq('user_id', user.id),
      supabase.from('detection_results').select('id, plate_number, violation_types, charges, confidence_score, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
      supabase.from('camera_nodes').select('id, name, status, camera_type').eq('user_id', user.id),
    ]);

    const allViolations = violationsRes.data || [];
    const allDetections = detectionsRes.data || [];
    const allCameras = camerasRes.data || [];

    const typeMap: Record<string, number> = {};
    const severityMap: Record<string, number> = {};
    const monthMap: Record<string, number> = {};
    let totalConfidence = 0;
    let totalFine = 0;

    allViolations.forEach(v => {
      typeMap[v.violation_type] = (typeMap[v.violation_type] || 0) + 1;
      severityMap[v.severity] = (severityMap[v.severity] || 0) + 1;
      totalConfidence += v.confidence_score || 0;
      totalFine += v.fine_amount || 0;
      const month = new Date(v.detected_at).toLocaleString('default', { month: 'short' });
      monthMap[month] = (monthMap[month] || 0) + 1;
    });

    const detectionTypeMap: Record<string, number> = {};
    let detectionRevenue = 0;
    let detectionConfidence = 0;
    let detectionCount = 0;

    allDetections.forEach(d => {
      d.violation_types?.forEach((t: string) => {
        detectionTypeMap[t] = (detectionTypeMap[t] || 0) + 1;
      });
      detectionRevenue += d.charges || 0;
      detectionConfidence += d.confidence_score || 0;
      detectionCount += d.violation_types?.length || 0;
    });

    Object.entries(detectionTypeMap).forEach(([k, v]) => {
      typeMap[k] = (typeMap[k] || 0) + v;
    });

    setViolationStats(Object.entries(typeMap).map(([k, v]) => ({ violation_type: k, count: v })));
    setSeverityStats(Object.entries(severityMap).map(([k, v]) => ({ severity: k, count: v })));
    setMonthlyStats(Object.entries(monthMap).map(([k, v]) => ({ month: k, count: v })));
    setDetectionStats(allDetections);
    setCameraStats(allCameras);
    setTotalViolations(allViolations.length + detectionCount);
    setTotalDetections(allDetections.length);
    setAvgConfidence(allViolations.length > 0 ? (totalConfidence + detectionConfidence) / (allViolations.length + allDetections.length) : 0);
    setTotalRevenue(totalFine + detectionRevenue);
    setActiveCameras(allCameras.filter(c => c.status === 'online').length);
  }, [user]);

  useEffect(() => {
    fetchAnalytics();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fetchAnalytics]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnalytics().then(() => setRefreshing(false));
  };

  const violationTypeLabel = (type: string) => type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  const maxCount = Math.max(...violationStats.map(v => v.count), 1);
  const maxSeverity = Math.max(...severityStats.map(v => v.count), 1);

  return (
    <PremiumScreen padHorizontal scroll noBackground>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>ANALYTICS</Text>
            <TouchableOpacity style={styles.periodButton} onPress={() => setShowPeriodPicker(!showPeriodPicker)}>
              <Calendar size={14} color={COLORS.text} />
              <Text style={styles.periodText}>{period}</Text>
              <ChevronDown size={14} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {showPeriodPicker && (
            <View style={styles.periodPicker}>
              {PERIODS.map(p => (
                <TouchableOpacity key={p} style={[styles.periodOption, period === p && styles.periodOptionActive]} onPress={() => { setPeriod(p); setShowPeriodPicker(false); }}>
                  <Text style={[styles.periodOptionText, period === p && styles.periodOptionTextActive]}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.text} />}
          >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                  <BarChart3 size={20} color={COLORS.error} strokeWidth={1.5} />
                  <Text style={styles.summaryNumber}>{totalViolations}</Text>
                  <Text style={styles.summaryLabel}>Total Violations</Text>
                </View>
                <View style={styles.summaryCard}>
                  <Upload size={20} color={COLORS.info} strokeWidth={1.5} />
                  <Text style={styles.summaryNumber}>{totalDetections}</Text>
                  <Text style={styles.summaryLabel}>Live Detections</Text>
                </View>
              </View>
              <View style={styles.summaryRow}>
                <View style={styles.summaryCard}>
                  <Activity size={20} color={COLORS.success} strokeWidth={1.5} />
                  <Text style={styles.summaryNumber}>{avgConfidence.toFixed(1)}%</Text>
                  <Text style={styles.summaryLabel}>Avg Confidence</Text>
                </View>
                <View style={styles.summaryCard}>
                  <DollarSign size={20} color={COLORS.warning} strokeWidth={1.5} />
                  <Text style={styles.summaryNumber}>${totalRevenue.toFixed(0)}</Text>
                  <Text style={styles.summaryLabel}>Total Revenue</Text>
                </View>
              </View>

              <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>CAMERA NETWORK</Text>
                <View style={styles.chartContainer}>
                  <View style={styles.cameraStatsRow}>
                    <View style={styles.cameraStatBox}>
                      <Camera size={20} color={COLORS.success} />
                      <Text style={styles.cameraStatNumber}>{activeCameras}</Text>
                      <Text style={styles.cameraStatLabel}>Active</Text>
                    </View>
                    <View style={styles.cameraStatBox}>
                      <Camera size={20} color={COLORS.error} />
                      <Text style={styles.cameraStatNumber}>{cameraStats.length - activeCameras}</Text>
                      <Text style={styles.cameraStatLabel}>Offline</Text>
                    </View>
                    <View style={styles.cameraStatBox}>
                      <Camera size={20} color={COLORS.info} />
                      <Text style={styles.cameraStatNumber}>{cameraStats.length}</Text>
                      <Text style={styles.cameraStatLabel}>Total</Text>
                    </View>
                  </View>
                  {cameraStats.map((cam, i) => (
                    <View key={i} style={styles.cameraRow}>
                      <Text style={styles.cameraRowName} numberOfLines={1}>{cam.name}</Text>
                      <View style={[styles.cameraRowDot, { backgroundColor: STATUS_NEU[cam.status] || COLORS.textMuted }]} />
                      <Text style={[styles.cameraRowStatus, { color: STATUS_NEU[cam.status] || COLORS.textMuted }]}>{cam.status}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>VIOLATIONS BY TYPE</Text>
                <View style={styles.chartContainer}>
                  {violationStats.map((v, i) => (
                    <View key={i} style={styles.barRow}>
                      <Text style={styles.barLabel} numberOfLines={1}>{violationTypeLabel(v.violation_type)}</Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${(v.count / maxCount) * 100}%`, backgroundColor: SEVERITY_NEU['high'] || COLORS.warning }]} />
                      </View>
                      <Text style={styles.barValue}>{v.count}</Text>
                    </View>
                  ))}
                  {violationStats.length === 0 && (
                    <Text style={styles.emptyText}>No data available</Text>
                  )}
                </View>
              </View>

              <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>SEVERITY DISTRIBUTION</Text>
                <View style={styles.chartContainer}>
                  {severityStats.map((s, i) => (
                    <View key={i} style={styles.barRow}>
                      <Text style={styles.barLabel} numberOfLines={1}>{s.severity.toUpperCase()}</Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${(s.count / maxSeverity) * 100}%`, backgroundColor: SEVERITY_NEU[s.severity] || COLORS.warning }]} />
                      </View>
                      <Text style={styles.barValue}>{s.count}</Text>
                    </View>
                  ))}
                  {severityStats.length === 0 && (
                    <Text style={styles.emptyText}>No data available</Text>
                  )}
                </View>
              </View>

              <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>MONTHLY TREND</Text>
                <View style={styles.chartContainer}>
                  {monthlyStats.map((m, i) => (
                    <View key={i} style={styles.barRow}>
                      <Text style={styles.barLabel}>{m.month}</Text>
                      <View style={styles.barTrack}>
                        <View style={[styles.barFill, { width: `${(m.count / Math.max(...monthlyStats.map(x => x.count), 1)) * 100}%`, backgroundColor: COLORS.info }]} />
                      </View>
                      <Text style={styles.barValue}>{m.count}</Text>
                    </View>
                  ))}
                  {monthlyStats.length === 0 && (
                    <Text style={styles.emptyText}>No data available</Text>
                  )}
                </View>
              </View>

              <View style={styles.chartSection}>
                <Text style={styles.chartTitle}>RECENT LIVE DETECTIONS</Text>
                <View style={styles.chartContainer}>
                  {detectionStats.slice(0, 10).map((d, i) => (
                    <View key={i} style={styles.detectionRow}>
                      <Text style={styles.detectionPlate}>{d.plate_number}</Text>
                      <Text style={styles.detectionViolations}>{d.violation_types?.length || 0} violations</Text>
                      <Text style={styles.detectionCharges}>${d.charges}</Text>
                    </View>
                  ))}
                  {detectionStats.length === 0 && (
                    <Text style={styles.emptyText}>No live detection data yet</Text>
                  )}
                </View>
              </View>
            </Animated.View>
            <View style={{ height: 24 }} />
          </ScrollView>
        </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEU.paper },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: NEU.ink, letterSpacing: 3 },
  periodButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: NEU.paper, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: NEU.ink },
  periodText: { fontSize: 12, color: NEU.ink, fontWeight: '600' },
  periodPicker: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 12 },
  periodOption: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: NEU.ink, backgroundColor: NEU.paper },
  periodOptionActive: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  periodOptionText: { fontSize: 11, color: COLORS.textMuted },
  periodOptionTextActive: { color: COLORS.primary, fontWeight: '700' },
  content: { paddingHorizontal: 20 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCard: {
    flex: 1,
    backgroundColor: NEU.paper,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: NEU.ink,
  },
  summaryNumber: { fontSize: 24, fontWeight: '800', color: NEU.ink, marginTop: 8 },
  summaryLabel: { fontSize: 11, color: COLORS.textMuted, marginTop: 4, letterSpacing: 0.5 },
  chartSection: { marginBottom: 24 },
  chartTitle: { fontSize: 12, fontWeight: '700', color: NEU.ink, letterSpacing: 2, marginBottom: 12 },
  chartContainer: { backgroundColor: NEU.paper, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: NEU.ink },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  barLabel: { width: 100, fontSize: 11, color: NEU.ink, fontWeight: '600' },
  barTrack: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 4, marginHorizontal: 8, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barValue: { width: 30, fontSize: 12, fontWeight: '700', color: NEU.ink, textAlign: 'right' },
  emptyText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingVertical: 20 },
  cameraStatsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  cameraStatBox: { flex: 1, alignItems: 'center', backgroundColor: PALETTE.cyan, borderRadius: 12, padding: 12 },
  cameraStatNumber: { fontSize: 20, fontWeight: '800', color: NEU.ink, marginTop: 6 },
  cameraStatLabel: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  cameraRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  cameraRowName: { fontSize: 12, color: NEU.ink, flex: 1 },
  cameraRowDot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 8 },
  cameraRowStatus: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  detectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  detectionPlate: { fontSize: 12, fontWeight: '700', color: NEU.ink, width: 80 },
  detectionViolations: { fontSize: 11, color: COLORS.textMuted, flex: 1 },
  detectionCharges: { fontSize: 12, fontWeight: '700', color: NEU.ink },
});
