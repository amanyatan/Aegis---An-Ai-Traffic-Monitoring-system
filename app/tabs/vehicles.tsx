import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, RefreshControl, TextInput, Modal, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE, SEVERITY_NEU, STATUS_NEU, iconColorForFill, COLORS } from '@/constants/neubrutalism';
import { Search, Car, X, ChevronRight, MapPin, User, FileText, Plus, Check } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface Vehicle {
  id: string;
  plate_number: string;
  make: string;
  model: string;
  color: string;
  vehicle_type: string;
  year: number;
  owner_name: string;
  registration_status: string;
}

export default function VehiclesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filtered, setFiltered] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Advanced search fields
  const [advPlate, setAdvPlate] = useState('');
  const [advMake, setAdvMake] = useState('');
  const [advModel, setAdvModel] = useState('');
  const [advColor, setAdvColor] = useState('');
  const [advLocation, setAdvLocation] = useState('');
  const [advDescription, setAdvDescription] = useState('');

  // Add vehicle form
  const [newPlate, setNewPlate] = useState('');
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newYear, setNewYear] = useState('');
  const [newType, setNewType] = useState('car');
  const [newOwner, setNewOwner] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const fetchVehicles = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('vehicles')
      .select('id, plate_number, make, model, color, vehicle_type, year, owner_name, registration_status')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setVehicles(data || []);
    setFiltered(data || []);
  }, [user]);

  useEffect(() => {
    fetchVehicles();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, [fetchVehicles]);

  useEffect(() => {
    let result = [...vehicles];
    const q = searchQuery.toLowerCase();
    if (q) {
      result = result.filter(v =>
        (v.plate_number?.toLowerCase() || '').includes(q) ||
        (v.make?.toLowerCase() || '').includes(q) ||
        (v.model?.toLowerCase() || '').includes(q) ||
        (v.owner_name?.toLowerCase() || '').includes(q) ||
        (v.color?.toLowerCase() || '').includes(q)
      );
    }
    if (advPlate) result = result.filter(v => (v.plate_number?.toLowerCase() || '').includes(advPlate.toLowerCase()));
    if (advMake) result = result.filter(v => (v.make?.toLowerCase() || '').includes(advMake.toLowerCase()));
    if (advModel) result = result.filter(v => (v.model?.toLowerCase() || '').includes(advModel.toLowerCase()));
    if (advColor) result = result.filter(v => (v.color?.toLowerCase() || '').includes(advColor.toLowerCase()));
    setFiltered(result);
  }, [vehicles, searchQuery, advPlate, advMake, advModel, advColor]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVehicles().then(() => setRefreshing(false));
  };

  const handleAddVehicle = async () => {
    if (!user || !newPlate.trim()) {
      Alert.alert('Error', 'Plate number is required');
      return;
    }
    const { error } = await supabase.from('vehicles').insert({
      user_id: user.id,
      plate_number: newPlate.trim(),
      make: newMake.trim() || null,
      model: newModel.trim() || null,
      color: newColor.trim() || null,
      vehicle_type: newType || null,
      year: newYear ? parseInt(newYear) : null,
      owner_name: newOwner.trim() || null,
      owner_phone: newPhone.trim() || null,
    });
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    setNewPlate('');
    setNewMake('');
    setNewModel('');
    setNewColor('');
    setNewYear('');
    setNewOwner('');
    setNewPhone('');
    setShowAddVehicle(false);
    fetchVehicles();
  };

  const vehicleTypeLabel = (type: string) => type?.replace(/\b\w/g, (l: string) => l.toUpperCase()) || 'Unknown';

  return (
    <>
    <PremiumScreen padHorizontal scroll refreshing={refreshing} onRefresh={onRefresh} noBackground>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>VEHICLE SEARCH</Text>
            <TouchableOpacity onPress={() => setShowAddVehicle(true)} style={styles.addButton}>
              <Plus size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Search size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Quick search by plate, make, model, owner..."
              placeholderTextColor={COLORS.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? <TouchableOpacity onPress={() => setSearchQuery('')}><X size={16} color={COLORS.textMuted} /></TouchableOpacity> : null}
          </View>

          <TouchableOpacity style={styles.advancedToggle} onPress={() => setShowAdvanced(!showAdvanced)}>
            <Text style={styles.advancedToggleText}>{showAdvanced ? 'Hide Advanced' : 'Advanced Search'}</Text>
            <ChevronRight size={14} color={COLORS.softAccent} style={{ transform: [{ rotate: showAdvanced ? '90deg' : '0deg' }] }} />
          </TouchableOpacity>

          {showAdvanced && (
            <View style={styles.advancedPanel}>
              <View style={styles.advancedRow}>
                <View style={styles.advancedField}>
                  <Text style={styles.advancedLabel}>Plate Number</Text>
                  <TextInput
                    style={styles.advancedInput}
                    placeholder="e.g. NYC-001A"
                    placeholderTextColor={COLORS.textMuted}
                    value={advPlate}
                    onChangeText={setAdvPlate}
                  />
                </View>
                <View style={styles.advancedField}>
                  <Text style={styles.advancedLabel}>Make</Text>
                  <TextInput
                    style={styles.advancedInput}
                    placeholder="e.g. Toyota"
                    placeholderTextColor={COLORS.textMuted}
                    value={advMake}
                    onChangeText={setAdvMake}
                  />
                </View>
              </View>
              <View style={styles.advancedRow}>
                <View style={styles.advancedField}>
                  <Text style={styles.advancedLabel}>Model</Text>
                  <TextInput
                    style={styles.advancedInput}
                    placeholder="e.g. Camry"
                    placeholderTextColor={COLORS.textMuted}
                    value={advModel}
                    onChangeText={setAdvModel}
                  />
                </View>
                <View style={styles.advancedField}>
                  <Text style={styles.advancedLabel}>Color</Text>
                  <TextInput
                    style={styles.advancedInput}
                    placeholder="e.g. Silver"
                    placeholderTextColor={COLORS.textMuted}
                    value={advColor}
                    onChangeText={setAdvColor}
                  />
                </View>
              </View>
              <View style={styles.advancedRow}>
                <View style={[styles.advancedField, { flex: 1 }]}>
                  <Text style={styles.advancedLabel}>Last Seen Location</Text>
                  <TextInput
                    style={styles.advancedInput}
                    placeholder="e.g. Main Street & 1st Ave"
                    placeholderTextColor={COLORS.textMuted}
                    value={advLocation}
                    onChangeText={setAdvLocation}
                  />
                </View>
              </View>
              <View style={styles.advancedRow}>
                <View style={[styles.advancedField, { flex: 1 }]}>
                  <Text style={styles.advancedLabel}>Description</Text>
                  <TextInput
                    style={[styles.advancedInput, { height: 60 }]} multiline
                    placeholder="Any additional details..."
                    placeholderTextColor={COLORS.textMuted}
                    value={advDescription}
                    onChangeText={setAdvDescription}
                  />
                </View>
              </View>
              <TouchableOpacity style={styles.clearButton} onPress={() => {
                setAdvPlate(''); setAdvMake(''); setAdvModel(''); setAdvColor(''); setAdvLocation(''); setAdvDescription(''); setSearchQuery('');
              }}>
                <Text style={styles.clearButtonText}>Clear All Filters</Text>
              </TouchableOpacity>
            </View>
          )}

          <Animated.View style={[styles.list, { opacity: fadeAnim }]}>
              {filtered.map((v) => (
                <TouchableOpacity key={v.id} style={styles.card} onPress={() => router.push(`/vehicle/${v.id}`)} activeOpacity={0.8}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardLeft}>
                      <View style={styles.plateRow}>
                        <View style={styles.plateBadge}>
                          <Text style={styles.plateText}>{v.plate_number || 'N/A'}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: `${STATUS_NEU[v.registration_status] || COLORS.textMuted}20` }]}>
                          <Text style={[styles.statusText, { color: STATUS_NEU[v.registration_status] || COLORS.textMuted }]}>{v.registration_status}</Text>
                        </View>
                      </View>
                      <Text style={styles.vehicleName}>{v.year} {v.make} {v.model}</Text>
                      <View style={styles.metaRow}>
                        <Car size={12} color={COLORS.textMuted} />
                        <Text style={styles.metaText}>{vehicleTypeLabel(v.vehicle_type)}</Text>
                        <Text style={styles.metaText}>Color: {v.color || 'N/A'}</Text>
                      </View>
                      <Text style={styles.ownerText}>Owner: {v.owner_name || 'N/A'}</Text>
                    </View>
                    <ChevronRight size={18} color={COLORS.textMuted} />
                  </View>
                </TouchableOpacity>
              ))}
              {filtered.length === 0 && (
                <View style={styles.emptyState}>
                  <Car size={40} color={COLORS.textMuted} strokeWidth={1} />
                  <Text style={styles.emptyText}>No vehicles found</Text>
                </View>
              )}
            </Animated.View>
            <View style={{ height: 24 }} />
    </PremiumScreen>

      {/* Add Vehicle Modal */}
      <Modal visible={showAddVehicle} transparent animationType="slide" onRequestClose={() => setShowAddVehicle(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>ADD VEHICLE</Text>
              <TouchableOpacity onPress={() => setShowAddVehicle(false)}>
                <X size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>PLATE NUMBER *</Text>
                <TextInput style={styles.formInput} placeholder="e.g. NYC-001A" placeholderTextColor={COLORS.textMuted} value={newPlate} onChangeText={setNewPlate} autoCapitalize="characters" />
              </View>
              <View style={styles.formRow}>
                <View style={styles.formHalf}>
                  <Text style={styles.formLabel}>MAKE</Text>
                  <TextInput style={styles.formInput} placeholder="Toyota" placeholderTextColor={COLORS.textMuted} value={newMake} onChangeText={setNewMake} />
                </View>
                <View style={styles.formHalf}>
                  <Text style={styles.formLabel}>MODEL</Text>
                  <TextInput style={styles.formInput} placeholder="Camry" placeholderTextColor={COLORS.textMuted} value={newModel} onChangeText={setNewModel} />
                </View>
              </View>
              <View style={styles.formRow}>
                <View style={styles.formHalf}>
                  <Text style={styles.formLabel}>COLOR</Text>
                  <TextInput style={styles.formInput} placeholder="Silver" placeholderTextColor={COLORS.textMuted} value={newColor} onChangeText={setNewColor} />
                </View>
                <View style={styles.formHalf}>
                  <Text style={styles.formLabel}>YEAR</Text>
                  <TextInput style={styles.formInput} placeholder="2023" placeholderTextColor={COLORS.textMuted} value={newYear} onChangeText={setNewYear} keyboardType="number-pad" />
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>TYPE</Text>
                <View style={styles.typePicker}>
                  {['car', 'motorcycle', 'truck', 'bus', 'van', 'suv'].map(t => (
                    <TouchableOpacity key={t} style={[styles.typeChip, newType === t && styles.typeChipActive]} onPress={() => setNewType(t)}>
                      <Text style={[styles.typeChipText, newType === t && styles.typeChipTextActive]}>{vehicleTypeLabel(t)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>OWNER NAME</Text>
                <TextInput style={styles.formInput} placeholder="John Smith" placeholderTextColor={COLORS.textMuted} value={newOwner} onChangeText={setNewOwner} />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>OWNER PHONE</Text>
                <TextInput style={styles.formInput} placeholder="555-0101" placeholderTextColor={COLORS.textMuted} value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" />
              </View>
              <TouchableOpacity style={styles.submitButton} onPress={handleAddVehicle}>
                <Check size={18} color={COLORS.primary} />
                <Text style={styles.submitButtonText}>ADD VEHICLE</Text>
              </TouchableOpacity>
              <View style={{ height: 24 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: NEU.paper },
  gradient: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: NEU.ink, letterSpacing: 3 },
  addButton: { padding: 8 },
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
    marginBottom: 8,
  },
  searchInput: { flex: 1, color: NEU.ink, fontSize: 14, marginLeft: 8 },
  advancedToggle: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 20, marginBottom: 8 },
  advancedToggleText: { fontSize: 12, color: NEU.ink, fontWeight: '600' },
  advancedPanel: { marginHorizontal: 20, marginBottom: 12, backgroundColor: NEU.paper, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: NEU.ink },
  advancedRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  advancedField: { flex: 1 },
  advancedLabel: { fontSize: 10, color: NEU.ink, letterSpacing: 1, fontWeight: '700', marginBottom: 4 },
  advancedInput: {
    backgroundColor: PALETTE.cyan,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: NEU.ink,
    fontSize: 13,
    borderWidth: 1,
    borderColor: NEU.ink,
  },
  clearButton: { alignItems: 'center', paddingVertical: 8 },
  clearButtonText: { fontSize: 12, color: COLORS.textMuted },
  list: { paddingHorizontal: 20 },
  card: {
    backgroundColor: NEU.paper,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: NEU.ink,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: { flex: 1 },
  plateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  plateBadge: { backgroundColor: PALETTE.cyan, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  plateText: { fontSize: 13, fontWeight: '700', color: NEU.ink, letterSpacing: 0.5 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  vehicleName: { fontSize: 15, fontWeight: '700', color: NEU.ink },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  metaText: { fontSize: 11, color: COLORS.textMuted },
  ownerText: { fontSize: 11, color: NEU.ink, marginTop: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, color: COLORS.textMuted },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(13, 27, 42, 0.9)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: NEU.paper, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: NEU.ink, letterSpacing: 2 },
  formGroup: { marginBottom: 12 },
  formLabel: { fontSize: 10, color: NEU.ink, letterSpacing: 1, fontWeight: '700', marginBottom: 4 },
  formInput: {
    backgroundColor: PALETTE.cyan,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: NEU.ink,
    fontSize: 14,
    borderWidth: 1,
    borderColor: NEU.ink,
  },
  formRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  formHalf: { flex: 1 },
  typePicker: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: NEU.ink, backgroundColor: NEU.paper },
  typeChipActive: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  typeChipText: { fontSize: 11, color: COLORS.textMuted },
  typeChipTextActive: { color: COLORS.primary, fontWeight: '700' },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.text,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
  },
  submitButtonText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
