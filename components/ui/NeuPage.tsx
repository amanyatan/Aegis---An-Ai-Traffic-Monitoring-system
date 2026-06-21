import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { NeoScreen } from '@/components/ui/NeoScreen';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE } from '@/constants/neubrutalism';

type StackPageProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerRight?: ReactNode;
  refreshing?: boolean;
  onRefresh?: () => void;
  showBack?: boolean;
};

export function NeuStackPage({
  title,
  subtitle,
  children,
  headerRight,
  refreshing,
  onRefresh,
  showBack = true,
}: StackPageProps) {
  const router = useRouter();

  return (
    <NeoScreen
      scroll
      padHorizontal
      refreshing={refreshing}
      onRefresh={onRefresh}
      headerRight={
        <View style={styles.headerRow}>
          {headerRight}
          {showBack ? (
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <ArrowLeft size={20} color={NEU.ink} strokeWidth={2.5} />
            </TouchableOpacity>
          ) : null}
        </View>
      }
      title={title}
      subtitle={subtitle}
    >
      {children}
    </NeoScreen>
  );
}

export function NeuModal({ visible, onClose, title, children }: { visible: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!visible) return null;
  return (
    <View style={styles.modalOverlay}>
      <NeoCard backgroundColor={NEU.paper} contentStyle={styles.modalCard}>
        <View style={styles.modalHead}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.modalClose}>
            <Text style={styles.modalCloseText}>×</Text>
          </TouchableOpacity>
        </View>
        {children}
      </NeoCard>
    </View>
  );
}

export const neuList = StyleSheet.create({
  card: { marginBottom: 10, width: '100%' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  title: { fontSize: 16, fontWeight: '900', color: NEU.ink },
  meta: { fontSize: 12, fontWeight: '600', color: '#555', marginTop: 4 },
  chip: {
    borderWidth: 2,
    borderColor: NEU.ink,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  chipText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  empty: { alignItems: 'center', paddingVertical: 48, gap: 10 },
  emptyText: { fontSize: 14, fontWeight: '700', color: '#666' },
  plate: {
    alignSelf: 'flex-start',
    backgroundColor: PALETTE.yellow,
    borderWidth: 2,
    borderColor: NEU.ink,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 6,
  },
  plateText: { fontSize: 13, fontWeight: '900', color: NEU.ink, letterSpacing: 0.5 },
});

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  backBtn: {
    width: 44,
    height: 44,
    borderWidth: NEU.borderWidth,
    borderColor: NEU.ink,
    borderRadius: NEU.radiusSm,
    backgroundColor: PALETTE.cyan,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  modalCard: { borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingBottom: 24 },
  modalHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '900', letterSpacing: 1, color: NEU.ink },
  modalClose: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  modalCloseText: { fontSize: 28, fontWeight: '900', color: NEU.ink, lineHeight: 30 },
});
