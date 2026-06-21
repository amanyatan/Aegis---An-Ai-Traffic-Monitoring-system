import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE, SEVERITY_NEU, STATUS_NEU, iconColorForFill , COLORS } from '@/constants/neubrutalism';
import { ArrowLeft, AlertTriangle, MapPin, Clock, DollarSign, Shield, CheckCircle, XCircle } from 'lucide-react-native';

export default function ViolationDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [violation, setViolation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      const { data } = await supabase.from('violations').select('*').eq('id', id).eq('user_id', user.id).single();
      setViolation(data);
      setLoading(false);
    };
    load();
  }, [id, user]);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return 'Unknown';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const violationTypeLabel = (type: string) => type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';

  if (loading) {
    return (
      <PremiumScreen padHorizontal scroll>
            <Text style={styles.loadingText}>Loading...</Text>
          </PremiumScreen>
    );
  }

  if (!violation) {
    return (
      <PremiumScreen padHorizontal scroll>
            <Text style={styles.loadingText}>Violation not found</Text>
          </PremiumScreen>
    );
  }

  return (
    <PremiumScreen padHorizontal scroll>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={22} color={COLORS.text} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>VIOLATION DETAIL</Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.mainCard}>
              <View style={styles.severityRow}>
                <AlertTriangle size={20} color={SEVERITY_NEU[violation.severity] || COLORS.warning} strokeWidth={1.5} />
                <View style={[styles.severityBadge, { backgroundColor: `${SEVERITY_NEU[violation.severity] || COLORS.warning}20` }]}>
                  <Text style={[styles.severityText, { color: SEVERITY_NEU[violation.severity] || COLORS.warning }]}>{violation.severity?.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.violationType}>{violationTypeLabel(violation.violation_type)}</Text>

              <View style={styles.plateRow}>
                <View style={styles.plateBadge}>
                  <Text style={styles.plateText}>{violation.plate_number || 'N/A'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${STATUS_NEU[violation.status] || COLORS.textMuted}20` }]}>
                  <Text style={[styles.statusText, { color: STATUS_NEU[violation.status] || COLORS.textMuted }]}>{violation.status}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Clock size={16} color={COLORS.textMuted} strokeWidth={1.5} />
                  <Text style={styles.infoLabel}>Detected</Text>
                  <Text style={styles.infoValue}>{formatTime(violation.detected_at)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <MapPin size={16} color={COLORS.textMuted} strokeWidth={1.5} />
                  <Text style={styles.infoLabel}>Location</Text>
                  <Text style={styles.infoValue}>{violation.location || 'Unknown'}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Shield size={16} color={COLORS.textMuted} strokeWidth={1.5} />
                  <Text style={styles.infoLabel}>Confidence</Text>
                  <Text style={styles.infoValue}>{violation.confidence_score?.toFixed(1)}%</Text>
                </View>
                <View style={styles.infoItem}>
                  <DollarSign size={16} color={COLORS.textMuted} strokeWidth={1.5} />
                  <Text style={styles.infoLabel}>Fine Amount</Text>
                  <Text style={styles.infoValue}>${violation.fine_amount || 0}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>EVIDENCE</Text>
              <View style={styles.evidenceBox}>
                <View style={styles.evidencePlaceholder}>
                  <Text style={styles.evidenceText}>Evidence image</Text>
                  <Text style={styles.evidenceSub}>Annotated frame from detection</Text>
                </View>
              </View>

              {violation.officer_notes && (
                <>
                  <Text style={styles.sectionTitle}>OFFICER NOTES</Text>
                  <Text style={styles.notesText}>{violation.officer_notes}</Text>
                </>
              )}
            </View>
            <View style={{ height: 24 }} />
          </ScrollView>
        </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEU.paper },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  loadingText: { color: NEU.ink, fontSize: 16, textAlign: 'center', marginTop: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: NEU.ink, letterSpacing: 3 },
  mainCard: { marginHorizontal: 20, backgroundColor: NEU.paper, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: NEU.ink },
  severityRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  severityBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  severityText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  violationType: { fontSize: 22, fontWeight: '800', color: NEU.ink, marginBottom: 12 },
  plateRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  plateBadge: { backgroundColor: PALETTE.cyan, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  plateText: { fontSize: 16, fontWeight: '800', color: NEU.ink, letterSpacing: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  infoItem: { width: '45%', gap: 4 },
  infoLabel: { fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 },
  infoValue: { fontSize: 14, color: NEU.ink, fontWeight: '600' },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: NEU.ink, letterSpacing: 2, marginBottom: 8 },
  evidenceBox: { marginBottom: 16 },
  evidencePlaceholder: { backgroundColor: PALETTE.cyan, borderRadius: 12, padding: 40, alignItems: 'center', borderWidth: 1, borderColor: NEU.ink, borderStyle: 'dashed' },
  evidenceText: { fontSize: 13, color: COLORS.textMuted },
  evidenceSub: { fontSize: 11, color: COLORS.textMuted, marginTop: 4 },
  notesText: { fontSize: 13, color: NEU.ink, lineHeight: 20 },
});