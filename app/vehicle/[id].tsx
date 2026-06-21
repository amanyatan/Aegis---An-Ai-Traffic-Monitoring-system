import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE, SEVERITY_NEU, STATUS_NEU, iconColorForFill , COLORS } from '@/constants/neubrutalism';
import { ArrowLeft, Car, Calendar, User, Phone, Shield, AlertTriangle, MapPin } from 'lucide-react-native';

export default function VehicleDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<any>(null);
  const [violations, setViolations] = useState<any[]>([]);
  const [sightings, setSightings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      const { data: v } = await supabase.from('vehicles').select('*').eq('id', id).eq('user_id', user.id).single();
      setVehicle(v);
      const { data: vio } = await supabase.from('violations').select('id, violation_type, severity, detected_at, location').eq('vehicle_id', id).eq('user_id', user.id).order('detected_at', { ascending: false });
      setViolations(vio || []);
      const { data: sig } = await supabase.from('vehicle_sightings').select('id, location, detected_at, confidence_score').eq('vehicle_id', id).eq('user_id', user.id).order('detected_at', { ascending: false });
      setSightings(sig || []);
      setLoading(false);
    };
    load();
  }, [id, user]);

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const violationTypeLabel = (type: string) => type.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  if (loading) {
    return (
      <PremiumScreen padHorizontal scroll>
            <Text style={styles.loadingText}>Loading...</Text>
          </PremiumScreen>
    );
  }

  if (!vehicle) {
    return (
      <PremiumScreen padHorizontal scroll>
            <Text style={styles.loadingText}>Vehicle not found</Text>
          </PremiumScreen>
    );
  }

  return (
    <PremiumScreen padHorizontal scroll>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={22} color={COLORS.text} strokeWidth={2} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>VEHICLE DETAIL</Text>
            <View style={{ width: 30 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.vehicleCard}>
              <View style={styles.plateBadge}>
                <Text style={styles.plateText}>{vehicle.plate_number || 'N/A'}</Text>
              </View>
              <View style={styles.vehicleHeader}>
                <Car size={32} color={COLORS.softAccent} strokeWidth={1.5} />
                <Text style={styles.vehicleName}>{vehicle.year} {vehicle.make} {vehicle.model}</Text>
                <View style={[styles.statusBadge, { backgroundColor: `${STATUS_NEU[vehicle.registration_status] || COLORS.textMuted}20` }]}>
                  <Text style={[styles.statusText, { color: STATUS_NEU[vehicle.registration_status] || COLORS.textMuted }]}>{vehicle.registration_status}</Text>
                </View>
              </View>
              <View style={styles.vehicleMeta}>
                <View style={styles.metaRow}>
                  <Calendar size={14} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>Year: {vehicle.year || 'N/A'}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Car size={14} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>Type: {vehicle.vehicle_type?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'N/A'}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Shield size={14} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>Color: {vehicle.color || 'N/A'}</Text>
                </View>
                <View style={styles.metaRow}>
                  <User size={14} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>Owner: {vehicle.owner_name || 'N/A'}</Text>
                </View>
                <View style={styles.metaRow}>
                  <Phone size={14} color={COLORS.textMuted} />
                  <Text style={styles.metaText}>Contact: {vehicle.owner_phone || 'N/A'}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>VIOLATIONS ({violations.length})</Text>
              {violations.map(v => (
                <TouchableOpacity key={v.id} style={styles.violationCard} onPress={() => router.push(`/violation/${v.id}`)}>
                  <Text style={styles.violationType}>{violationTypeLabel(v.violation_type)}</Text>
                  <View style={styles.violationMeta}>
                    <MapPin size={12} color={COLORS.textMuted} />
                    <Text style={styles.violationLocation}>{v.location || 'Unknown'}</Text>
                    <Text style={styles.violationTime}>{formatTime(v.detected_at)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
              {violations.length === 0 && (
                <Text style={styles.emptyText}>No violations recorded</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>SIGHTINGS ({sightings.length})</Text>
              {sightings.map(s => (
                <View key={s.id} style={styles.sightingCard}>
                  <View style={styles.sightingRow}>
                    <MapPin size={14} color={COLORS.textMuted} />
                    <Text style={styles.sightingLocation}>{s.location || 'Unknown'}</Text>
                    <Text style={styles.sightingTime}>{formatTime(s.detected_at)}</Text>
                  </View>
                  <Text style={styles.sightingConfidence}>{s.confidence_score?.toFixed(0)}% confidence</Text>
                </View>
              ))}
              {sightings.length === 0 && (
                <Text style={styles.emptyText}>No sightings recorded</Text>
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
  vehicleCard: { marginHorizontal: 20, backgroundColor: NEU.paper, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: NEU.ink, marginBottom: 24 },
  plateBadge: { backgroundColor: PALETTE.cyan, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'center', marginBottom: 12 },
  plateText: { fontSize: 16, fontWeight: '800', color: NEU.ink, letterSpacing: 1 },
  vehicleHeader: { alignItems: 'center', gap: 8 },
  vehicleName: { fontSize: 18, fontWeight: '700', color: NEU.ink },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  vehicleMeta: { marginTop: 16, gap: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaText: { fontSize: 13, color: COLORS.textMuted },
  section: { marginHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: NEU.ink, letterSpacing: 2, marginBottom: 12 },
  violationCard: { backgroundColor: NEU.paper, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: NEU.ink },
  violationType: { fontSize: 14, fontWeight: '600', color: NEU.ink },
  violationMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  violationLocation: { fontSize: 11, color: COLORS.textMuted, flex: 1 },
  violationTime: { fontSize: 11, color: NEU.ink },
  sightingCard: { backgroundColor: NEU.paper, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: NEU.ink },
  sightingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sightingLocation: { fontSize: 13, color: NEU.ink, flex: 1 },
  sightingTime: { fontSize: 11, color: COLORS.textMuted },
  sightingConfidence: { fontSize: 11, color: NEU.ink, marginTop: 4 },
  emptyText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', paddingVertical: 16 },
});
