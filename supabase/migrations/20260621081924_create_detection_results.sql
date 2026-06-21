/*
# Create detection_results table

1. New Table
- `detection_results` — stores AI detection results from uploaded images/videos
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users, defaults to auth.uid)
- `source_type` (text: 'upload' or 'camera')
- `media_url` (text, original uploaded file)
- `plate_number` (text, detected plate)
- `violation_types` (text[], array of detected violations)
- `charges` (numeric, total fine amount)
- `confidence_score` (numeric)
- `location` (text)
- `vehicle_make` (text)
- `vehicle_model` (text)
- `vehicle_color` (text)
- `vehicle_type` (text)
- `detection_metadata` (jsonb, raw AI detection data)
- `created_at` (timestamptz)

2. Security
- RLS enabled
- Owner-scoped CRUD policies
*/

CREATE TABLE IF NOT EXISTS detection_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type text NOT NULL DEFAULT 'upload' CHECK (source_type IN ('upload', 'camera', 'live')),
  media_url text,
  plate_number text,
  violation_types text[] DEFAULT '{}',
  charges numeric(10,2) DEFAULT 0,
  confidence_score numeric(5,2),
  location text,
  vehicle_make text,
  vehicle_model text,
  vehicle_color text,
  vehicle_type text,
  detection_metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE detection_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_results" ON detection_results;
CREATE POLICY "select_own_results" ON detection_results FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_results" ON detection_results;
CREATE POLICY "insert_own_results" ON detection_results FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_results" ON detection_results;
CREATE POLICY "update_own_results" ON detection_results FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_results" ON detection_results;
CREATE POLICY "delete_own_results" ON detection_results FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_detection_results_plate ON detection_results(plate_number);
CREATE INDEX IF NOT EXISTS idx_detection_results_created ON detection_results(created_at);
