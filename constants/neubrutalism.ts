/** Recommended neubrutalism palette */
export const PALETTE = {
  cyan: '#7DF9FF',
  green: '#2FFF2F',
  magenta: '#FF00F5',
  blue: '#3300FF',
  yellow: '#FFFF00',
  orange: '#FF4911',
} as const;

export const NEU = {
  ink: '#000000',
  paper: '#FFFFFF',
  borderWidth: 3,
  shadowOffset: 5,
  radius: 14,
  radiusSm: 10,
} as const;

/** Force white neubrutalism canvas across the app */
export type NeuTheme = {
  isDark: boolean;
  canvas: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  iconOnCanvas: string;
  iconOnSurface: string;
};

export function getNeuTheme(): NeuTheme {
  return {
    isDark: false,
    canvas: NEU.paper,
    surface: NEU.paper,
    text: NEU.ink,
    textMuted: '#555555',
    border: NEU.ink,
    iconOnCanvas: NEU.ink,
    iconOnSurface: NEU.ink,
  };
}

export function useNeuTheme(): NeuTheme {
  return getNeuTheme();
}

const LIGHT_BACKGROUNDS = new Set<string>([PALETTE.cyan, PALETTE.green, PALETTE.yellow, NEU.paper]);

export function iconColorForFill(fillColor: string): string {
  if (LIGHT_BACKGROUNDS.has(fillColor)) return NEU.ink;
  return NEU.paper;
}

export function textColorForFill(fillColor: string): string {
  return iconColorForFill(fillColor);
}

export const STAT_FILLS = [PALETTE.orange, PALETTE.yellow, PALETTE.green, PALETTE.blue] as const;
export const ACTION_FILLS = [PALETTE.blue, PALETTE.magenta, PALETTE.cyan, PALETTE.orange] as const;

export const SEVERITY_NEU: Record<string, string> = {
  low: PALETTE.cyan,
  minor: PALETTE.cyan,
  info: PALETTE.cyan,
  medium: PALETTE.yellow,
  moderate: PALETTE.yellow,
  warning: PALETTE.yellow,
  high: PALETTE.orange,
  major: PALETTE.orange,
  critical: PALETTE.magenta,
  fatal: PALETTE.magenta,
};

export const STATUS_NEU: Record<string, string> = {
  active: PALETTE.green,
  online: PALETTE.green,
  pending: PALETTE.yellow,
  confirmed: PALETTE.magenta,
  resolved: PALETTE.green,
  recovered: PALETTE.green,
  missing: PALETTE.orange,
  searching: PALETTE.yellow,
  closed: PALETTE.cyan,
  dismissed: PALETTE.cyan,
  reviewed: PALETTE.blue,
  paid: PALETTE.green,
  offline: '#AAAAAA',
  maintenance: PALETTE.yellow,
  error: PALETTE.magenta,
  responded: PALETTE.blue,
  investigating: PALETTE.yellow,
  cleared: PALETTE.green,
};

/** Legacy alias — mapped to premium dark theme */
export const COLORS = {
  primary: '#E0E1DD',
  text: '#E0E1DD',
  textMuted: 'rgba(224, 225, 221, 0.65)',
  softAccent: '#778DA9',
  error: '#E07A5F',
  success: '#5CB8A0',
  warning: '#C9A227',
  info: '#6B9AC4',
  border: 'rgba(119, 141, 169, 0.35)',
  surface: 'rgba(27, 38, 59, 0.55)',
};
