import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LucideIcon } from 'lucide-react-native';
import { CameraBackground } from '@/components/ui/CameraBackground';
import { NeoCard } from '@/components/ui/NeoCard';
import { NEU, PALETTE, useNeuTheme } from '@/constants/neubrutalism';

type NeoScreenProps = {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  scroll?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  keyboardAvoiding?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  padHorizontal?: boolean;
};

export function NeoScreen({
  children,
  title,
  subtitle,
  headerRight,
  scroll = true,
  refreshing,
  onRefresh,
  keyboardAvoiding,
  contentStyle,
  padHorizontal = false,
}: NeoScreenProps) {
  const theme = useNeuTheme();

  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[padHorizontal && styles.padH, contentStyle]}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={!!refreshing} onRefresh={onRefresh} tintColor={NEU.ink} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padHorizontal && styles.padH, contentStyle]}>{children}</View>
  );

  const content = (
    <>
      {(title || headerRight) && (
        <View style={[styles.header, padHorizontal && styles.padH]}>
          <View style={styles.headerLeft}>
            {title ? <Text style={[styles.headerTitle, { color: theme.text }]}>{title}</Text> : null}
            {subtitle ? <Text style={[styles.headerSub, { color: theme.textMuted }]}>{subtitle}</Text> : null}
          </View>
          {headerRight}
        </View>
      )}
      {body}
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: theme.canvas }]}>
      <CameraBackground />
      <SafeAreaView style={styles.flex}>
        {keyboardAvoiding ? (
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {content}
          </KeyboardAvoidingView>
        ) : (
          content
        )}
      </SafeAreaView>
    </View>
  );
}

type NeoSearchProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  onClear?: () => void;
  right?: ReactNode;
};

export function NeoSearchBar({ value, onChangeText, placeholder, onClear, right }: NeoSearchProps) {
  return (
    <NeoCard shadow={false} contentStyle={styles.searchInner}>
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
      />
      {value && onClear ? (
        <TouchableOpacity onPress={onClear} style={styles.searchClear}>
          <Text style={styles.searchClearText}>×</Text>
        </TouchableOpacity>
      ) : null}
      {right}
    </NeoCard>
  );
}

type NeoChipProps = {
  label: string;
  active?: boolean;
  onPress?: () => void;
  fill?: string;
};

export function NeoChip({ label, active, onPress, fill = PALETTE.cyan }: NeoChipProps) {
  const bg = active ? NEU.ink : NEU.paper;
  const color = active ? NEU.paper : NEU.ink;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, { backgroundColor: bg, borderColor: NEU.ink }]}
      activeOpacity={0.85}
    >
      {!active && <View style={[styles.chipAccent, { backgroundColor: fill }]} />}
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

type NeoButtonProps = {
  label: string;
  onPress?: () => void;
  fill?: string;
  icon?: LucideIcon;
  small?: boolean;
};

export function NeoButton({ label, onPress, fill = PALETTE.yellow, icon: Icon, small }: NeoButtonProps) {
  const textColor = fill === PALETTE.yellow || fill === PALETTE.cyan || fill === PALETTE.green ? NEU.ink : NEU.paper;
  return (
    <NeoCard backgroundColor={fill} onPress={onPress} contentStyle={small ? styles.btnSmall : styles.btn}>
      {Icon ? <Icon size={18} color={textColor} strokeWidth={2.5} /> : null}
      <Text style={[styles.btnText, { color: textColor }]}>{label}</Text>
    </NeoCard>
  );
}

export function NeoSectionTitle({ title, actionLabel, onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} style={styles.sectionAction}>
          <Text style={styles.sectionActionText}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function NeoInput(props: React.ComponentProps<typeof TextInput> & { label?: string }) {
  const { label, style, ...rest } = props;
  return (
    <View style={styles.inputWrap}>
      {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
      <NeoCard shadow={false} contentStyle={styles.inputCard}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor="#888"
          {...rest}
        />
      </NeoCard>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  padH: { paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerSub: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    minHeight: 52,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: NEU.ink,
  },
  searchClear: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  searchClearText: { fontSize: 22, fontWeight: '900', color: NEU.ink, lineHeight: 24 },
  chip: {
    borderWidth: NEU.borderWidth,
    borderRadius: NEU.radiusSm,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipAccent: { width: 8, height: 8, borderRadius: 4, borderWidth: 1, borderColor: NEU.ink },
  chipText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.3 },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  btnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  btnText: { fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
    color: NEU.ink,
  },
  sectionAction: {
    borderWidth: NEU.borderWidth,
    borderColor: NEU.ink,
    backgroundColor: PALETTE.yellow,
    borderRadius: NEU.radiusSm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sectionActionText: { fontSize: 10, fontWeight: '900', color: NEU.ink, letterSpacing: 0.5 },
  inputWrap: { marginBottom: 12 },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: NEU.ink,
    marginBottom: 6,
  },
  inputCard: { paddingVertical: 4, paddingHorizontal: 12 },
  input: {
    fontSize: 15,
    fontWeight: '600',
    color: NEU.ink,
    paddingVertical: 10,
  },
});
