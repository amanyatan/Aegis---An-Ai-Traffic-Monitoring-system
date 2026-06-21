import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AegisBackground } from '@/components/premium/AegisBackground';
import { COLORS, FONTS, SPACING } from '@/constants/theme';

type PremiumScreenProps = {
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
  noBackground?: boolean;
};

export function PremiumScreen({
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
  noBackground,
}: PremiumScreenProps) {
  const body = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[padHorizontal && styles.padH, contentStyle]}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={!!refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.pearl}
          />
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
            {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
            {subtitle ? <Text style={styles.headerSub}>{subtitle}</Text> : null}
          </View>
          {headerRight}
        </View>
      )}
      {body}
    </>
  );

  return (
    <View style={styles.root}>
      {!noBackground && <AegisBackground />}
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

export function SectionTitle({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHead}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel && onAction ? (
        <Text style={styles.sectionAction} onPress={onAction}>{actionLabel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.abyss },
  flex: { flex: 1 },
  padH: { paddingHorizontal: SPACING.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.md,
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    fontFamily: FONTS.display,
    fontSize: 22,
    color: COLORS.pearl,
    letterSpacing: 2,
  },
  headerSub: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.pearlMuted,
    marginTop: 4,
  },
  sectionHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    color: COLORS.pearl,
    letterSpacing: 0.5,
  },
  sectionAction: {
    fontFamily: FONTS.bodySemi,
    fontSize: 12,
    color: COLORS.mist,
  },
});
