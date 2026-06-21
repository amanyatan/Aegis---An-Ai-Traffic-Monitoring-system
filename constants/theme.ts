/** Premium AEGIS design system — dark intelligence platform */
export const COLORS = {
  abyss: '#0D1B2A',
  deep: '#1B263B',
  slate: '#415A77',
  mist: '#778DA9',
  pearl: '#E0E1DD',
  pearlMuted: 'rgba(224, 225, 221, 0.65)',
  pearlSubtle: 'rgba(224, 225, 221, 0.4)',
  accent: '#778DA9',
  accentGlow: 'rgba(119, 141, 169, 0.45)',
  success: '#5CB8A0',
  warning: '#C9A227',
  danger: '#E07A5F',
  info: '#6B9AC4',
} as const;

export const GLASS = {
  bg: 'rgba(27, 38, 59, 0.55)',
  bgStrong: 'rgba(27, 38, 59, 0.78)',
  border: 'rgba(119, 141, 169, 0.22)',
  borderGlow: 'rgba(119, 141, 169, 0.45)',
  highlight: 'rgba(224, 225, 221, 0.06)',
} as const;

export const FONTS = {
  display: 'Orbitron_700Bold',
  displayMedium: 'Orbitron_500Medium',
  heading: 'SpaceGrotesk_700Bold',
  headingMedium: 'SpaceGrotesk_500Medium',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemi: 'Inter_600SemiBold',
  bodyBold: 'Inter_700Bold',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  hero: 64,
} as const;

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  full: 9999,
} as const;

export const SHADOWS = {
  glow: {
    shadowColor: COLORS.accentGlow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 6,
  },
} as const;

export const SEVERITY_COLORS: Record<string, string> = {
  low: COLORS.info,
  minor: COLORS.info,
  medium: COLORS.warning,
  moderate: COLORS.warning,
  high: COLORS.danger,
  critical: COLORS.danger,
  fatal: COLORS.danger,
};

export const STATUS_COLORS: Record<string, string> = {
  active: COLORS.success,
  online: COLORS.success,
  pending: COLORS.warning,
  offline: COLORS.mist,
  confirmed: COLORS.danger,
};
