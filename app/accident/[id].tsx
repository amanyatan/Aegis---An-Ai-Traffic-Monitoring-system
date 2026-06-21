import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE, SEVERITY_NEU, STATUS_NEU, iconColorForFill , COLORS } from '@/constants/neubrutalism';
import { ArrowLeft, MapPin, Clock, Car, Users, Shield, AlertTriangle } from 'lucide-react-native';

export default function AccidentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [accident, setAccident] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      const { data } = await supabase.from('accidents').select('*').eq('id', id).eq('user_id', user.id).single();
      setAccident(data);
      setLoading(false);
    };
    load();
  }, [id, user]);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return 'Unknown';
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <PremiumScreen padHorizontal scroll>
            <Text style={styles.loadingText}>Loading...</Text>
          </PremiumScreen>
    );
  }

  if (!accident) {
    return (
      <PremiumScreen padHorizontal scroll>
            <Text style={styles.loadingText}>Accident not found</Text>
          </PremiumScreen>
    );
  }

  return (
    <PremiumScreen padHorizontal scroll>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={22} color={COLORS.text} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>ACCIDENT DETAIL</Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.mainCard}>
              <View style={styles.severityRow}>
                <AlertTriangle size={20} color={SEVERITY_NEU[accident.severity] || COLORS.error} strokeWidth={1.5} />
                <View style={[styles.severityBadge, { backgroundColor: `${SEVERITY_NEU[accident.severity] || COLORS.error}20` }]}>
                  <Text style={[styles.severityText, { color: SEVERITY_NEU[accident.severity] || COLORS.error }]}>{accident.severity?.toUpperCase()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${STATUS_NEU[accident.status] || COLORS.textMuted}20` }]}>
                  <Text style={[styles.statusText, { color: STATUS_NEU[accident.status] || COLORS.textMuted }]}>{accident.status}</Text>
                </View>
              </View>

              <Text style={styles.location}>{accident.location || 'Unknown location'}</Text>

              <View style={styles.divider} />

              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Clock size={16} color={COLORS.textMuted} strokeWidth={1.5} />
                  <Text style={styles.infoLabel}>Reported</Text>
                  <Text style={styles.infoValue}>{formatTime(accident.reported_at)}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Car size={16} color={COLORS.textMuted} strokeWidth={1.5} />
                  <Text style={styles.infoLabel}>Vehicles</Text>
                  <Text style={styles.infoValue}>{accident.vehicles_involved}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Users size={16} color={COLORS.textMuted} strokeWidth={1.5} />
                  <Text style={styles.infoLabel}>Injuries</Text>
                  <Text style={styles.infoValue}>{accident.injuries}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Shield size={16} color={COLORS.textMuted} strokeWidth={1.5} />
                  <Text style={styles.infoLabel}>Fatalities</Text>
                  <Text style={styles.infoValue}>{accident.fatalities}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>DESCRIPTION</Text>
              <Text style={styles.descriptionText}>{accident.description || 'No description provided'}</Text>
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
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  location: { fontSize: 20, fontWeight: '800', color: NEU.ink, marginBottom: 4 },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 16 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  infoItem: { width: '45%', gap: 4 },
  infoLabel: { fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 },
  infoValue: { fontSize: 14, color: NEU.ink, fontWeight: '600' },
  sectionTitle: { fontSize: 11, fontWeight: '700', color: NEU.ink, letterSpacing: 2, marginBottom: 8 },
  descriptionText: { fontSize: 13, color: NEU.ink, lineHeight: 20 },
});
