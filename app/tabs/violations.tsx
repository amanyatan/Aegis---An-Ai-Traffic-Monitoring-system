import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { NEU, PALETTE, SEVERITY_NEU, STATUS_NEU, iconColorForFill } from '@/constants/neubrutalism';
import { PremiumScreen, SectionTitle } from '@/components/premium/PremiumScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { AlertTriangle, Search, Filter, MapPin, Clock } from 'lucide-react-native';

interface Violation {
  id: string;
  plate_number: string;
  violation_type: string;
  severity: string;
  confidence_score: number;
  location: string;
  detected_at: string;
  status: string;
  fine_amount: number;
}

const VIOLATION_TYPES = ['all', 'speeding', 'red_light', 'stop_line', 'illegal_parking', 'wrong_side', 'no_helmet', 'no_seatbelt', 'triple_riding', 'overloading', 'drunk_driving', 'using_phone', 'reckless_driving'];
const SEVERITIES = ['all', 'low', 'medium', 'high', 'critical'];
const STATUSES = ['all', 'pending', 'reviewed', 'confirmed', 'dismissed', 'paid'];

export default function ViolationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [violations, setViolations] = useState<Violation[]>([]);
  const [filtered, setFiltered] = useState<Violation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fetchViolations = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('violations')
      .select('id, plate_number, violation_type, severity, confidence_score, location, detected_at, status, fine_amount')
      .eq('user_id', user.id)
      .order('detected_at', { ascending: false });
    setViolations(data || []);
    setFiltered(data || []);
  }, [user]);

  useEffect(() => {
    fetchViolations();
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fetchViolations]);

  useEffect(() => {
    let result = [...violations];
    if (searchQuery) {
      result = result.filter(v =>
        (v.plate_number?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (v.location?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        v.violation_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (typeFilter !== 'all') result = result.filter(v => v.violation_type === typeFilter);
    if (severityFilter !== 'all') result = result.filter(v => v.severity === severityFilter);
    if (statusFilter !== 'all') result = result.filter(v => v.status === statusFilter);
    setFiltered(result);
  }, [violations, searchQuery, typeFilter, severityFilter, statusFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchViolations().then(() => setRefreshing(false));
  };

  const formatTime = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const violationTypeLabel = (type: string) => type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const FilterChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <PremiumScreen
      title="VIOLATIONS"
      subtitle={`${filtered.length} records`}
      refreshing={refreshing}
      onRefresh={onRefresh}
      padHorizontal
      noBackground
    >
      <NeoCard shadow={false} contentStyle={styles.searchInner}>
        <Search size={18} color={NEU.ink} strokeWidth={2.5} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search plate, type, location..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)} style={styles.filterBtn}>
          <Filter size={18} color={NEU.ink} strokeWidth={2.5} />
        </TouchableOpacity>
      </NeoCard>

      {showFilters && (
        <NeoCard contentStyle={styles.filterPanel}>
          <Text style={styles.filterLabel}>TYPE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {VIOLATION_TYPES.map(t => (
              <FilterChip key={t} label={t === 'all' ? 'All' : violationTypeLabel(t)} active={typeFilter === t} onPress={() => setTypeFilter(t)} />
            ))}
          </ScrollView>
          <Text style={styles.filterLabel}>SEVERITY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {SEVERITIES.map(s => (
              <FilterChip key={s} label={s === 'all' ? 'All' : s} active={severityFilter === s} onPress={() => setSeverityFilter(s)} />
            ))}
          </ScrollView>
          <Text style={styles.filterLabel}>STATUS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {STATUSES.map(s => (
              <FilterChip key={s} label={s === 'all' ? 'All' : s} active={statusFilter === s} onPress={() => setStatusFilter(s)} />
            ))}
          </ScrollView>
        </NeoCard>
      )}

      <Animated.View style={{ opacity: fadeAnim, marginTop: 12 }}>
        {filtered.map((v) => {
          const sevFill = SEVERITY_NEU[v.severity] || PALETTE.orange;
          const statFill = STATUS_NEU[v.status] || PALETTE.cyan;
          return (
            <NeoCard key={v.id} onPress={() => router.push(`/violation/${v.id}`)} style={styles.card}>
              <View style={styles.cardHead}>
                <View style={styles.plateBadge}>
                  <Text style={styles.plateText}>{v.plate_number || 'N/A'}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: sevFill }]}>
                  <Text style={[styles.badgeText, { color: iconColorForFill(sevFill) }]}>{v.severity}</Text>
                </View>
              </View>
              <Text style={styles.typeText}>{violationTypeLabel(v.violation_type)}</Text>
              <View style={styles.metaRow}>
                <MapPin size={12} color={NEU.ink} strokeWidth={2.5} />
                <Text style={styles.meta}>{v.location || 'Unknown'}</Text>
                <Clock size={12} color={NEU.ink} strokeWidth={2.5} />
                <Text style={styles.meta}>{formatTime(v.detected_at)}</Text>
              </View>
              <View style={styles.footer}>
                <View style={[styles.badge, { backgroundColor: statFill }]}>
                  <Text style={[styles.badgeText, { color: iconColorForFill(statFill) }]}>{v.status}</Text>
                </View>
                <Text style={styles.meta}>{v.confidence_score?.toFixed(0)}%</Text>
                <Text style={styles.fine}>${v.fine_amount || 0}</Text>
              </View>
            </NeoCard>
          );
        })}
        {filtered.length === 0 && (
          <NeoCard contentStyle={styles.empty}>
            <AlertTriangle size={36} color={NEU.ink} strokeWidth={2.5} />
            <Text style={styles.emptyText}>No violations found</Text>
          </NeoCard>
        )}
      </Animated.View>
      <View style={{ height: 24 }} />
    </PremiumScreen>
  );
}

const styles = StyleSheet.create({
  searchInner: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, marginBottom: 12 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15, fontWeight: '600', color: NEU.ink },
  filterBtn: { padding: 6, marginLeft: 4 },
  filterPanel: { marginBottom: 12, gap: 8 },
  filterLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 1, color: NEU.ink },
  chip: { borderWidth: 2, borderColor: NEU.ink, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, backgroundColor: NEU.paper },
  chipActive: { backgroundColor: NEU.ink },
  chipText: { fontSize: 11, fontWeight: '800', color: NEU.ink },
  chipTextActive: { color: NEU.paper },
  card: { marginBottom: 10 },
  cardHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  plateBadge: { backgroundColor: PALETTE.yellow, borderWidth: 2, borderColor: NEU.ink, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  plateText: { fontSize: 13, fontWeight: '900', color: NEU.ink },
  badge: { borderWidth: 2, borderColor: NEU.ink, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  typeText: { fontSize: 15, fontWeight: '800', color: NEU.ink, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  meta: { fontSize: 11, fontWeight: '600', color: '#555' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 2, borderTopColor: NEU.ink, paddingTop: 10 },
  fine: { fontSize: 14, fontWeight: '900', color: NEU.ink },
  empty: { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, fontWeight: '700', color: '#666' },
});
