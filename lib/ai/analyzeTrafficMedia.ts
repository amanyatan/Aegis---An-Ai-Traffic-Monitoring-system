import {
  FINE_MAP,
  VIOLATION_TYPES,
  calculateTotalCharges,
  ViolationType,
} from '@/constants/violations';
import { mediaUriToBase64 } from '@/lib/ai/mediaToBase64';
import { AnalyzeTrafficOptions, TrafficDetectionResult } from '@/lib/ai/types';

const GEMINI_MODEL = 'gemini-2.0-flash';

const DEMO_MAKES = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Tesla', 'Audi', 'Hyundai'];
const DEMO_MODELS = ['Camry', 'Civic', 'F-150', 'X5', 'C-Class', 'Model 3', 'A4', 'Elantra'];
const DEMO_COLORS = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray'];
const DEMO_TYPES = ['car', 'motorcycle', 'truck', 'bus', 'van', 'suv'];

type GeminiPayload = {
  plate_number?: string | null;
  violation_types?: string[];
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_color?: string;
  vehicle_type?: string;
  confidence_score?: number;
  summary?: string;
};

function normalizeViolations(values: string[] | undefined): ViolationType[] {
  const allowed = new Set<string>(VIOLATION_TYPES);
  return (values ?? [])
    .map((v) => v.toLowerCase().trim().replace(/\s+/g, '_'))
    .filter((v): v is ViolationType => allowed.has(v));
}

function buildPrompt(location?: string): string {
  return [
    'You are a traffic enforcement vision system.',
    'Analyze the image for vehicles, license plates, and traffic violations.',
    location ? `Camera location hint: ${location}.` : '',
    `Return ONLY JSON with keys: plate_number (string|null), violation_types (array from: ${VIOLATION_TYPES.join(', ')}), vehicle_make, vehicle_model, vehicle_color, vehicle_type (car|motorcycle|truck|bus|van|suv), confidence_score (0-100 number), summary (one sentence).`,
    'If no plate is readable, set plate_number to null.',
    'If no violations are visible, return an empty violation_types array.',
  ]
    .filter(Boolean)
    .join(' ');
}

async function analyzeWithGemini(
  uri: string,
  apiKey: string,
  location?: string
): Promise<GeminiPayload> {
  const { base64, mimeType } = await mediaUriToBase64(uri);

  if (!mimeType.startsWith('image/')) {
    throw new Error('Video analysis requires Gemini; use a photo for best results.');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: buildPrompt(location) },
              { inline_data: { mime_type: mimeType, data: base64 } },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText.slice(0, 180)}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini returned an empty response');

  return JSON.parse(text) as GeminiPayload;
}

function analyzeWithDemo(uri: string, location?: string): GeminiPayload {
  const detectedViolations = [
    VIOLATION_TYPES[Math.floor(Math.random() * VIOLATION_TYPES.length)],
    Math.random() > 0.55
      ? VIOLATION_TYPES[Math.floor(Math.random() * VIOLATION_TYPES.length)]
      : null,
  ].filter(Boolean) as ViolationType[];

  return {
    plate_number: `NYC-${Math.floor(100 + Math.random() * 900)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    violation_types: detectedViolations,
    vehicle_make: DEMO_MAKES[Math.floor(Math.random() * DEMO_MAKES.length)],
    vehicle_model: DEMO_MODELS[Math.floor(Math.random() * DEMO_MODELS.length)],
    vehicle_color: DEMO_COLORS[Math.floor(Math.random() * DEMO_COLORS.length)],
    vehicle_type: DEMO_TYPES[Math.floor(Math.random() * DEMO_TYPES.length)],
    confidence_score: parseFloat((Math.random() * 12 + 86).toFixed(1)),
    summary: `Demo analysis for ${uri.split('/').pop() ?? 'uploaded media'}${location ? ` near ${location}` : ''}.`,
  };
}

function toResult(
  payload: GeminiPayload,
  uri: string,
  options: AnalyzeTrafficOptions,
  provider: 'gemini' | 'demo'
): TrafficDetectionResult {
  const violations = normalizeViolations(payload.violation_types);
  const confidence = Math.min(100, Math.max(0, Number(payload.confidence_score) || 75));
  const plate =
    payload.plate_number?.trim() ||
    (provider === 'demo' ? 'UNKNOWN' : 'NOT DETECTED');

  return {
    plate_number: plate,
    violation_types: violations,
    charges: calculateTotalCharges(violations),
    confidence_score: parseFloat(confidence.toFixed(1)),
    vehicle_make: payload.vehicle_make?.trim() || 'Unknown',
    vehicle_model: payload.vehicle_model?.trim() || 'Unknown',
    vehicle_color: payload.vehicle_color?.trim() || 'Unknown',
    vehicle_type: payload.vehicle_type?.trim() || 'car',
    location: options.location?.trim() || 'Main Street & 1st Ave',
    media_url: uri,
    source_type: options.source ?? 'upload',
    detection_metadata: {
      provider,
      summary: payload.summary,
      ocr_confidence: Math.max(0, confidence - 4),
      detected_objects: ['vehicle', 'license_plate', ...violations],
      bounding_box: { x: 120, y: 80, width: 200, height: 150 },
      raw: provider === 'gemini' ? payload : undefined,
    },
  };
}

export function isAiConfigured(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim());
}

export async function analyzeTrafficMedia(
  uri: string,
  options: AnalyzeTrafficOptions = {}
): Promise<TrafficDetectionResult> {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY?.trim();

  if (apiKey) {
    const payload = await analyzeWithGemini(uri, apiKey, options.location);
    return toResult(payload, uri, options, 'gemini');
  }

  await new Promise((r) => setTimeout(r, 1800));
  const payload = analyzeWithDemo(uri, options.location);
  return toResult(payload, uri, options, 'demo');
}

export { FINE_MAP };
