import { ViolationType } from '@/constants/violations';

export type TrafficDetectionResult = {
  plate_number: string;
  violation_types: ViolationType[];
  charges: number;
  confidence_score: number;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_color: string;
  vehicle_type: string;
  location: string;
  media_url: string;
  source_type: 'upload' | 'camera' | 'live';
  detection_metadata: {
    provider: 'gemini' | 'demo';
    summary?: string;
    bounding_box?: { x: number; y: number; width: number; height: number };
    ocr_confidence?: number;
    detected_objects?: string[];
    raw?: unknown;
  };
};

export type AnalyzeTrafficOptions = {
  location?: string;
  source?: 'upload' | 'camera' | 'live';
};
