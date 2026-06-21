import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE, SEVERITY_NEU, STATUS_NEU, iconColorForFill , COLORS } from '@/constants/neubrutalism';
import { Shield, ChevronRight, MapPin, Clock, AlertTriangle, Car, Users } from 'lucide-react-native';

interface Accident {
  id: string;
  location: string;
  severity: string;
  status: string;
  vehicles_involved: number;
  injuries: number;
  fatalities: number;
  description: string;
  reported_at: string;
}

export default function AccidentsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [accidents, setAccidents] = useState<Accident[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchAccidents = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('accidents')
      .select('id, location, severity, status, vehicles_involved, injuries, fatalities, description, reported_at')
      .eq('user_id', user.id)
      .order('reported_at', { ascending: false });
    setAccidents(data || []);
  }, [user]);

  useEffect(() => {
    fetchAccidents();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fetchAccidents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAccidents().then(() => setRefreshing(false));
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <PremiumScreen padHorizontal scroll noBackground>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronRight size={22} color={COLORS.text} style={{ transform: [{ rotate: '180deg' }] }} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>ACCIDENTS</Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.text} />}
          >
            <Animated.View style={[styles.list, { opacity: fadeAnim }]}>
              {accidents.map((a) => (
                <View key={a.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.severityBadge}>
                      <AlertTriangle size={14} color={SEVERITY_NEU[a.severity] || COLORS.error} />
                      <Text style={[styles.severityText, { color: SEVERITY_NEU[a.severity] || COLORS.error }]}>{a.severity.toUpperCase()}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${STATUS_NEU[a.status] || COLORS.textMuted}20` }]}>
                      <Text style={[styles.statusText, { color: STATUS_NEU[a.status] || COLORS.textMuted }]}>{a.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.location}>{a.location || 'Unknown location'}</Text>
                  <Text style={styles.description}>{a.description || 'No description'}</Text>
                  <View style={styles.cardMeta}>
                    <View style={styles.metaRow}>
                      <Car size={12} color={COLORS.textMuted} />
                      <Text style={styles.metaText}>{a.vehicles_involved} vehicles</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Users size={12} color={COLORS.textMuted} />
                      <Text style={styles.metaText}>{a.injuries} injuries</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Shield size={12} color={COLORS.textMuted} />
                      <Text style={styles.metaText}>{a.fatalities} fatalities</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Clock size={12} color={COLORS.textMuted} />
                      <Text style={styles.metaText}>{formatTime(a.reported_at)}</Text>
                    </View>
                  </View>
                </View>
              ))}
              {accidents.length === 0 && (
                <View style={styles.emptyState}>
                  <Shield size={40} color={COLORS.textMuted} strokeWidth={1} />
                  <Text style={styles.emptyText}>No accidents reported</Text>
                </View>
              )}
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
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: NEU.ink, letterSpacing: 3 },
  list: { paddingHorizontal: 20 },
  card: {
    backgroundColor: NEU.paper,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: NEU.ink,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  severityBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: PALETTE.cyan, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  severityText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  location: { fontSize: 14, fontWeight: '700', color: NEU.ink },
  description: { fontSize: 12, color: COLORS.textMuted, marginTop: 4, lineHeight: 18 },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textMuted },
});
