/** High-contrast black/white palette for operational screens */
export const PALETTE = {
  cyan: '#FFFFFF',
  green: '#000000',
  magenta: '#000000',
  blue: '#000000',
  yellow: '#FFFFFF',
  orange: '#000000',
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

const LIGHT_BACKGROUNDS = new Set<string>([PALETTE.cyan, PALETTE.yellow, NEU.paper]);

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
  low: NEU.ink,
  minor: NEU.ink,
  info: NEU.ink,
  medium: NEU.ink,
  moderate: NEU.ink,
  warning: NEU.ink,
  high: NEU.ink,
  major: NEU.ink,
  critical: NEU.ink,
  fatal: NEU.ink,
};

export const STATUS_NEU: Record<string, string> = {
  active: NEU.ink,
  online: NEU.ink,
  pending: NEU.ink,
  confirmed: NEU.ink,
  resolved: NEU.ink,
  recovered: NEU.ink,
  missing: NEU.ink,
  searching: NEU.ink,
  closed: '#555555',
  dismissed: '#555555',
  reviewed: NEU.ink,
  paid: NEU.ink,
  offline: '#555555',
  maintenance: NEU.ink,
  error: NEU.ink,
  responded: NEU.ink,
  investigating: NEU.ink,
  cleared: NEU.ink,
};

/** Legacy alias — mapped to premium dark theme */
export const COLORS = {
  primary: '#FFFFFF',
  text: '#000000',
  textMuted: '#555555',
  softAccent: '#000000',
  error: '#000000',
  success: '#000000',
  warning: '#000000',
  info: '#000000',
  border: '#D0D0D0',
  surface: '#FFFFFF',
};
