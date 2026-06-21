import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, RefreshControl, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE, SEVERITY_NEU, STATUS_NEU, iconColorForFill , COLORS } from '@/constants/neubrutalism';
import { Search, Shield, X, MapPin, Clock, ChevronRight } from 'lucide-react-native';

interface MissingVehicle {
  id: string;
  plate_number: string;
  make: string;
  model: string;
  color: string;
  vehicle_type: string;
  last_seen_location: string;
  last_seen_at: string;
  status: string;
  description: string;
  contact_phone: string;
}

export default function MissingVehiclesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [missing, setMissing] = useState<MissingVehicle[]>([]);
  const [filtered, setFiltered] = useState<MissingVehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchMissing = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('missing_vehicles')
      .select('id, plate_number, make, model, color, vehicle_type, last_seen_location, last_seen_at, status, description, contact_phone')
      .eq('user_id', user.id)
      .order('report_date', { ascending: false });
    setMissing(data || []);
    setFiltered(data || []);
  }, [user]);

  useEffect(() => {
    fetchMissing();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fetchMissing]);

  useEffect(() => {
    if (searchQuery) {
      setFiltered(missing.filter(m =>
        (m.plate_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (m.make?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (m.model?.toLowerCase() || '').includes(searchQuery.toLowerCase())
      ));
    } else {
      setFiltered(missing);
    }
  }, [searchQuery, missing]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchMissing().then(() => setRefreshing(false));
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return 'Unknown';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <PremiumScreen padHorizontal scroll noBackground>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ChevronRight size={22} color={COLORS.text} style={{ transform: [{ rotate: '180deg' }] }} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>MISSING VEHICLES</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.searchBar}>
            <Search size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search missing vehicles..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? <TouchableOpacity onPress={() => setSearchQuery('')}><X size={16} color={COLORS.textMuted} /></TouchableOpacity> : null}
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.text} />}
          >
            <Animated.View style={[styles.list, { opacity: fadeAnim }]}>
              {filtered.map((m) => (
                <View key={m.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.plateBadge}>
                      <Text style={styles.plateText}>{m.plate_number || 'N/A'}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: `${STATUS_NEU[m.status] || COLORS.error}20` }]}>
                      <Text style={[styles.statusText, { color: STATUS_NEU[m.status] || COLORS.error }]}>{m.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.vehicleName}>{m.make} {m.model}</Text>
                  <Text style={styles.vehicleDetail}>{m.color} {m.vehicle_type}</Text>
                  <View style={styles.cardMeta}>
                    <View style={styles.metaRow}>
                      <MapPin size={12} color={COLORS.textMuted} />
                      <Text style={styles.metaText}>{m.last_seen_location || 'Unknown'}</Text>
                    </View>
                    <View style={styles.metaRow}>
                      <Clock size={12} color={COLORS.textMuted} />
                      <Text style={styles.metaText}>Last seen: {formatTime(m.last_seen_at)}</Text>
                    </View>
                  </View>
                  <Text style={styles.description}>{m.description || 'No description provided'}</Text>
                  <Text style={styles.contact}>Contact: {m.contact_phone || 'N/A'}</Text>
                </View>
              ))}
              {filtered.length === 0 && (
                <View style={styles.emptyState}>
                  <Shield size={40} color={COLORS.textMuted} strokeWidth={1} />
                  <Text style={styles.emptyText}>No missing vehicles reported</Text>
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: NEU.paper,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: NEU.ink,
    marginBottom: 12,
  },
  searchInput: { flex: 1, color: NEU.ink, fontSize: 14, marginLeft: 8 },
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
  plateBadge: { backgroundColor: PALETTE.cyan, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  plateText: { fontSize: 13, fontWeight: '700', color: NEU.ink, letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  vehicleName: { fontSize: 15, fontWeight: '700', color: NEU.ink },
  vehicleDetail: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  cardMeta: { marginTop: 8, gap: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  description: { fontSize: 12, color: NEU.ink, marginTop: 8, lineHeight: 18 },
  contact: { fontSize: 11, color: NEU.ink, marginTop: 6 },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textMuted },
});
