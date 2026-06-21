export const VIOLATION_TYPES = [
  'speeding',
  'red_light',
  'stop_line',
  'illegal_parking',
  'wrong_side',
  'no_helmet',
  'no_seatbelt',
  'triple_riding',
  'overloading',
  'drunk_driving',
  'using_phone',
  'reckless_driving',
] as const;

export type ViolationType = (typeof VIOLATION_TYPES)[number];

export const FINE_MAP: Record<ViolationType, number> = {
  speeding: 250,
  red_light: 150,
  stop_line: 100,
  illegal_parking: 75,
  wrong_side: 300,
  no_helmet: 200,
  no_seatbelt: 90,
  triple_riding: 180,
  overloading: 350,
  drunk_driving: 500,
  using_phone: 125,
  reckless_driving: 450,
};

export function calculateTotalCharges(violations: string[]): number {
  return violations.reduce((sum, v) => sum + (FINE_MAP[v as ViolationType] ?? 100), 0);
}

export function violationTypeLabel(type: string): string {
  return type?.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Unknown';
}
