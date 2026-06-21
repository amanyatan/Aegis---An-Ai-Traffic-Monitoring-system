import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions, RefreshControl, Modal, Alert, Platform, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { PremiumScreen } from '@/components/premium/PremiumScreen';
import { NEU, PALETTE, COLORS, STATUS_NEU, SEVERITY_NEU } from '@/constants/neubrutalism';
import { Camera, WifiOff, Upload, Video, X, Check, AlertTriangle, MapPin, Car, DollarSign, Shield, ScanEye } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeTrafficMedia, isAiConfigured } from '@/lib/ai/analyzeTrafficMedia';
import { FINE_MAP, violationTypeLabel } from '@/constants/violations';

const { width } = Dimensions.get('window');

interface CameraNode {
  id: string;
  name: string;
  location: string;
  camera_type: string;
  status: string;
  coverage_radius: number;
}

interface DetectionResult {
  id: string;
  plate_number: string;
  violation_types: string[];
  charges: number;
  confidence_score: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  created_at: string;
}

export default function LiveFeedScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [cameras, setCameras] = useState<CameraNode[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [detectModal, setDetectModal] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState<any>(null);
  const [recentResults, setRecentResults] = useState<DetectionResult[]>([]);
  const [locationInput, setLocationInput] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const fetchCameras = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('camera_nodes').select('id, name, location, camera_type, status, coverage_radius').eq('user_id', user.id).order('status', { ascending: false });
    setCameras(data || []);
  }, [user]);

  const fetchRecentResults = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('detection_results').select('id, plate_number, violation_types, charges, confidence_score, vehicle_make, vehicle_model, vehicle_color, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10);
    setRecentResults(data || []);
  }, [user]);

  useEffect(() => {
    fetchCameras();
    fetchRecentResults();
    Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, [fetchCameras, fetchRecentResults]);

  const onRefresh = () => {
    setRefreshing(true);
    Promise.all([fetchCameras(), fetchRecentResults()]).then(() => setRefreshing(false));
  };

  const cameraTypeIcon = (type: string) => {
    switch (type) {
      case 'cctv': return 'CCTV';
      case 'speed': return 'SPD';
      case 'anpr': return 'ANPR';
      case 'thermal': return 'THR';
      case 'drone': return 'DRN';
      default: return 'CAM';
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Media library access is needed to upload.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      runDetection(result.assets[0].uri, 'upload');
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera access is needed to record violations.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      runDetection(result.assets[0].uri, 'camera');
    }
  };

  const runDetection = async (mediaUri: string, source: 'upload' | 'camera') => {
    setUploadModal(false);
    setDetecting(true);
    setDetectModal(true);
    setDetectionResult(null);

    try {
      const result = await analyzeTrafficMedia(mediaUri, {
        location: locationInput,
        source,
      });

      if (user) {
        const { detection_metadata, ...row } = result;
        await supabase.from('detection_results').insert({
          user_id: user.id,
          ...row,
          detection_metadata,
        });
        await fetchRecentResults();
      }

      setDetectionResult(result);
    } catch (error) {
      setDetectModal(false);
      Alert.alert(
        'Detection failed',
        error instanceof Error ? error.message : 'Unable to analyze this media. Try another image.'
      );
    } finally {
      setDetecting(false);
    }
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
    <>
    <PremiumScreen padHorizontal scroll refreshing={refreshing} onRefresh={onRefresh}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>LIVE FEED</Text>
            <View style={styles.liveIndicator}>
              <Animated.View style={[styles.liveDot, { transform: [{ scale: pulseAnim }] }]} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setUploadModal(true)} activeOpacity={0.8}>
              <Upload size={18} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Upload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={openCamera} activeOpacity={0.8}>
              <Camera size={18} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Open Camera</Text>
            </TouchableOpacity>
          </View>

          {recentResults.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>RECENT DETECTIONS</Text>
                {recentResults.map((r) => (
                  <View key={r.id} style={styles.resultCard}>
                    <View style={styles.resultHeader}>
                      <View style={styles.plateBadge}>
                        <Text style={styles.plateText}>{r.plate_number}</Text>
                      </View>
                      <Text style={styles.resultTime}>{formatTime(r.created_at)}</Text>
                    </View>
                    <Text style={styles.resultVehicle}>{r.vehicle_color} {r.vehicle_make} {r.vehicle_model}</Text>
                    <View style={styles.resultViolations}>
                      {r.violation_types.map((v, i) => (
                        <View key={i} style={styles.violationChip}>
                          <AlertTriangle size={10} color={COLORS.error} />
                          <Text style={styles.violationChipText}>{violationTypeLabel(v)}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.resultFooter}>
                      <Text style={styles.resultConfidence}>{r.confidence_score?.toFixed(0)}% confidence</Text>
                      <Text style={styles.resultCharges}>${r.charges} total</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>CAMERA NODES</Text>
              <Animated.View style={[styles.cameraGrid, { opacity: fadeAnim }]}>
                {cameras.map((cam) => (
                  <TouchableOpacity
                    key={cam.id}
                    style={[
                      styles.cameraCard,
                      selectedCamera === cam.id && styles.cameraCardSelected,
                      cam.status === 'offline' && styles.cameraCardOffline,
                    ]}
                    onPress={() => setSelectedCamera(selectedCamera === cam.id ? null : cam.id)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.cameraHeader}>
                      <View style={styles.cameraTypeBadge}>
                        <Text style={styles.cameraTypeText}>{cameraTypeIcon(cam.camera_type || 'cctv')}</Text>
                      </View>
                      <View style={[styles.statusIndicator, { backgroundColor: STATUS_NEU[cam.status] || COLORS.textMuted }]} />
                    </View>

                    <View style={styles.cameraPreview}>
                      {cam.status === 'online' ? (
                        <View style={styles.previewBox}>
                          <View style={styles.scanLine} />
                          <View style={styles.gridOverlay}>
                            <View style={styles.gridLineH} />
                            <View style={styles.gridLineV} />
                          </View>
                          <View style={styles.detectionBox}>
                            <Text style={styles.detectionLabel}>AI DETECTING</Text>
                            <View style={styles.confidenceBar}>
                              <View style={[styles.confidenceFill, { width: `${Math.random() * 40 + 60}%` }]} />
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View style={styles.offlineBox}>
                          <WifiOff size={24} color={COLORS.textMuted} />
                          <Text style={styles.offlineText}>Offline</Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.cameraInfo}>
                      <Text style={styles.cameraName} numberOfLines={1}>{cam.name}</Text>
                      <Text style={styles.cameraLocation} numberOfLines={1}>{cam.location || 'Unknown location'}</Text>
                      <View style={styles.cameraMeta}>
                        <Text style={styles.cameraMetaText}>{cam.coverage_radius}m radius</Text>
                        <Text style={[styles.cameraStatus, { color: STATUS_NEU[cam.status] || COLORS.textMuted }]}>{cam.status}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </Animated.View>

              {cameras.length === 0 && (
                <View style={styles.emptyState}>
                  <Camera size={48} color={COLORS.textMuted} strokeWidth={1} />
                  <Text style={styles.emptyTitle}>No Cameras Active</Text>
                  <Text style={styles.emptyText}>Camera nodes will appear here once connected</Text>
                </View>
              )}
            </View>

            <View style={{ height: 24 }} />
    </PremiumScreen>

      {/* Upload Modal */}
      <Modal visible={uploadModal} transparent animationType="slide" onRequestClose={() => setUploadModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>AI DETECTION</Text>
              <TouchableOpacity onPress={() => setUploadModal(false)}>
                <X size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSub}>
              {isAiConfigured()
                ? 'Gemini vision will analyze the image for plates and violations.'
                : 'Demo mode active — add EXPO_PUBLIC_GEMINI_API_KEY for real AI analysis.'}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Location (optional)"
              placeholderTextColor={COLORS.textMuted}
              value={locationInput}
              onChangeText={setLocationInput}
            />
            <TouchableOpacity style={styles.modalButton} onPress={pickImage} activeOpacity={0.8}>
              <Upload size={18} color={COLORS.primary} />
              <Text style={styles.modalButtonText}>Pick from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={openCamera} activeOpacity={0.8}>
              <Camera size={18} color={COLORS.primary} />
              <Text style={styles.modalButtonText}>Open Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Detection Result Modal */}
      <Modal visible={detectModal} transparent animationType="fade" onRequestClose={() => setDetectModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {detecting ? (
              <View style={styles.detectingBox}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <ScanEye size={48} color={COLORS.success} />
                </Animated.View>
                <Text style={styles.detectingText}>Analyzing...</Text>
                <Text style={styles.detectingSub}>
                  {isAiConfigured()
                    ? 'Gemini is reading plates and checking for violations'
                    : 'Running demo detection (add Gemini API key for live AI)'}
                </Text>
                <View style={styles.progressBar}>
                  <Animated.View style={[styles.progressFill, { width: '100%' }]} />
                </View>
              </View>
            ) : detectionResult ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.resultHeaderRow}>
                  <Text style={styles.modalTitle}>DETECTION RESULT</Text>
                  <TouchableOpacity onPress={() => setDetectModal(false)}>
                    <X size={22} color={COLORS.text} />
                  </TouchableOpacity>
                </View>
                <View style={styles.resultPlateBox}>
                  <Car size={20} color={COLORS.text} />
                  <Text style={styles.resultPlateText}>{detectionResult.plate_number}</Text>
                </View>
                <View style={styles.resultVehicleBox}>
                  <Text style={styles.resultVehicleText}>{detectionResult.vehicle_color} {detectionResult.vehicle_make} {detectionResult.vehicle_model}</Text>
                  <Text style={styles.resultVehicleSub}>{detectionResult.vehicle_type?.replace(/\b\w/g, (l: string) => l.toUpperCase())}</Text>
                </View>
                {detectionResult.detection_metadata?.summary ? (
                  <Text style={styles.resultSummary}>{detectionResult.detection_metadata.summary}</Text>
                ) : null}
                <Text style={styles.resultSectionTitle}>VIOLATIONS DETECTED</Text>
                {detectionResult.violation_types.length === 0 ? (
                  <Text style={styles.noViolationsText}>No violations detected in this frame.</Text>
                ) : null}
                {detectionResult.violation_types.map((v: string, i: number) => (
                  <View key={i} style={styles.violationResultRow}>
                    <View style={styles.violationResultLeft}>
                      <AlertTriangle size={14} color={COLORS.error} />
                      <Text style={styles.violationResultName}>{violationTypeLabel(v)}</Text>
                    </View>
                    <Text style={styles.violationResultFine}>${FINE_MAP[v as keyof typeof FINE_MAP] ?? 100}</Text>
                  </View>
                ))}
                <View style={styles.resultDivider} />
                <View style={styles.resultTotalRow}>
                  <Text style={styles.resultTotalLabel}>Total Charges</Text>
                  <Text style={styles.resultTotalValue}>${detectionResult.charges}</Text>
                </View>
                <View style={styles.resultMeta}>
                  <View style={styles.resultMetaRow}>
                    <MapPin size={14} color={COLORS.textMuted} />
                    <Text style={styles.resultMetaText}>{detectionResult.location}</Text>
                  </View>
                  <View style={styles.resultMetaRow}>
                    <Shield size={14} color={COLORS.textMuted} />
                    <Text style={styles.resultMetaText}>{detectionResult.confidence_score}% confidence</Text>
                  </View>
                </View>
                <View style={styles.resultSavedBadge}>
                  <Check size={14} color={COLORS.success} />
                  <Text style={styles.resultSavedText}>Saved to database</Text>
                </View>
                <TouchableOpacity style={styles.resultCloseButton} onPress={() => setDetectModal(false)}>
                  <Text style={styles.resultCloseText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
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
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  liveText: { fontSize: 12, fontWeight: '700', color: COLORS.error, letterSpacing: 1 },
  actionBar: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 16 },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.text,
    borderRadius: 12,
    paddingVertical: 12,
  },
  actionButtonText: { fontSize: 13, fontWeight: '700', color: COLORS.primary, letterSpacing: 0.5 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: NEU.ink, letterSpacing: 2, marginBottom: 12 },
  resultCard: {
    backgroundColor: NEU.paper,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: NEU.ink,
  },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  plateBadge: { backgroundColor: PALETTE.cyan, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  plateText: { fontSize: 13, fontWeight: '700', color: NEU.ink, letterSpacing: 0.5 },
  resultTime: { fontSize: 11, color: COLORS.textMuted },
  resultVehicle: { fontSize: 13, color: NEU.ink, fontWeight: '600', marginBottom: 6 },
  resultViolations: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  violationChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(192, 57, 43, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  violationChipText: { fontSize: 10, color: COLORS.error, fontWeight: '600' },
  resultFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8 },
  resultConfidence: { fontSize: 11, color: COLORS.textMuted },
  resultCharges: { fontSize: 13, fontWeight: '700', color: NEU.ink },
  cameraGrid: { gap: 12 },
  cameraCard: {
    backgroundColor: NEU.paper,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: NEU.ink,
  },
  cameraCardSelected: { borderColor: COLORS.softAccent, borderWidth: 2 },
  cameraCardOffline: { opacity: 0.6 },
  cameraHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12 },
  cameraTypeBadge: { backgroundColor: PALETTE.cyan, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cameraTypeText: { fontSize: 10, fontWeight: '700', color: NEU.ink, letterSpacing: 0.5 },
  statusIndicator: { width: 8, height: 8, borderRadius: 4 },
  cameraPreview: { height: 180, backgroundColor: PALETTE.cyan, position: 'relative', overflow: 'hidden' },
  previewBox: { flex: 1, position: 'relative', backgroundColor: '#0a1520' },
  scanLine: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: 'rgba(46, 139, 87, 0.4)', zIndex: 2 },
  gridOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 },
  gridLineH: { position: 'absolute', top: '50%', left: 0, right: 0, height: 1, backgroundColor: 'rgba(119, 141, 169, 0.1)' },
  gridLineV: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(119, 141, 169, 0.1)' },
  detectionBox: { position: 'absolute', bottom: 12, left: 12, right: 12, backgroundColor: 'rgba(13, 27, 42, 0.8)', borderRadius: 8, padding: 8, zIndex: 3 },
  detectionLabel: { fontSize: 10, color: COLORS.success, fontWeight: '700', letterSpacing: 1 },
  confidenceBar: { height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 6, overflow: 'hidden' },
  confidenceFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 2 },
  offlineBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  offlineText: { fontSize: 13, color: COLORS.textMuted },
  cameraInfo: { padding: 12 },
  cameraName: { fontSize: 14, fontWeight: '700', color: NEU.ink },
  cameraLocation: { fontSize: 11, color: COLORS.textMuted, marginTop: 2 },
  cameraMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  cameraMetaText: { fontSize: 10, color: COLORS.textMuted },
  cameraStatus: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: NEU.ink },
  emptyText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(13, 27, 42, 0.9)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: NEU.paper, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: NEU.ink, letterSpacing: 2 },
  modalSub: { fontSize: 13, color: COLORS.textMuted, marginBottom: 16 },
  modalInput: {
    backgroundColor: PALETTE.cyan,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: NEU.ink,
    fontSize: 14,
    borderWidth: 1,
    borderColor: NEU.ink,
    marginBottom: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.text,
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },
  modalButtonText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  detectingBox: { alignItems: 'center', paddingVertical: 40 },
  detectingText: { fontSize: 18, fontWeight: '700', color: NEU.ink, marginTop: 16 },
  detectingSub: { fontSize: 13, color: COLORS.textMuted, marginTop: 4 },
  progressBar: { width: '80%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, marginTop: 20, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.success, borderRadius: 2 },
  resultHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resultPlateBox: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: PALETTE.cyan, borderRadius: 12, padding: 14, marginBottom: 12 },
  resultPlateText: { fontSize: 20, fontWeight: '800', color: NEU.ink, letterSpacing: 2 },
  resultVehicleBox: { marginBottom: 16 },
  resultVehicleText: { fontSize: 16, fontWeight: '700', color: NEU.ink },
  resultVehicleSub: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  resultSectionTitle: { fontSize: 11, fontWeight: '700', color: NEU.ink, letterSpacing: 2, marginBottom: 10 },
  resultSummary: { fontSize: 13, color: COLORS.textMuted, marginBottom: 12, lineHeight: 18 },
  noViolationsText: { fontSize: 13, color: COLORS.textMuted, marginBottom: 12 },
  violationResultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  violationResultLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  violationResultName: { fontSize: 14, color: NEU.ink, fontWeight: '600' },
  violationResultFine: { fontSize: 14, fontWeight: '700', color: COLORS.error },
  resultDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
  resultTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultTotalLabel: { fontSize: 14, fontWeight: '600', color: NEU.ink },
  resultTotalValue: { fontSize: 20, fontWeight: '800', color: COLORS.error },
  resultMeta: { gap: 6, marginBottom: 12 },
  resultMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultMetaText: { fontSize: 12, color: COLORS.textMuted },
  resultSavedBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(46, 139, 87, 0.15)', borderRadius: 8, padding: 10, marginBottom: 16 },
  resultSavedText: { fontSize: 12, fontWeight: '700', color: COLORS.success },
  resultCloseButton: { backgroundColor: COLORS.text, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  resultCloseText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
});
