/*
# AEGIS Core Database Schema

1. New Tables
- `profiles` — extends auth.users with role, avatar, department info
- `vehicles` — registered vehicle records with plate, make, model, color
- `violations` — traffic violation records with type, confidence, evidence
- `vehicle_sightings` — timestamps and locations where vehicles were spotted
- `missing_vehicles` — missing vehicle reports with status and recovery info
- `accidents` — accident reports with severity, location, status
- `traffic_predictions` — AI-generated traffic predictions per location
- `road_hazards` — detected or reported road hazards
- `reports` — generated analytics reports with metadata
- `notifications` — system alerts for users
- `camera_nodes` — CCTV camera metadata and status
- `audit_logs` — system audit trail for compliance

2. Security
- RLS enabled on ALL tables.
- Owner-scoped policies for authenticated users.
- Role-based access via `profiles.role` enum.

3. Important Notes
- `user_id` columns default to `auth.uid()` for seamless inserts.
- `profiles` rows are created via trigger on `auth.users` insert.
- All timestamp columns use `timestamptz`.
*/

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text NOT NULL,
  avatar_url text,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'traffic_police', 'operator', 'viewer')),
  department text,
  badge_number text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- Trigger to create profile on new auth user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''), 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plate_number text NOT NULL UNIQUE,
  make text,
  model text,
  color text,
  vehicle_type text CHECK (vehicle_type IN ('car', 'motorcycle', 'truck', 'bus', 'van', 'suv', 'other')),
  year integer,
  owner_name text,
  owner_phone text,
  registration_status text DEFAULT 'active' CHECK (registration_status IN ('active', 'expired', 'suspended', 'stolen')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_vehicles" ON vehicles;
CREATE POLICY "select_own_vehicles" ON vehicles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_vehicles" ON vehicles;
CREATE POLICY "insert_own_vehicles" ON vehicles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_vehicles" ON vehicles;
CREATE POLICY "update_own_vehicles" ON vehicles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_vehicles" ON vehicles;
CREATE POLICY "delete_own_vehicles" ON vehicles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Violations table
CREATE TABLE IF NOT EXISTS violations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  plate_number text,
  violation_type text NOT NULL CHECK (violation_type IN (
    'speeding', 'red_light', 'stop_line', 'illegal_parking', 'wrong_side',
    'no_helmet', 'no_seatbelt', 'triple_riding', 'overloading', 'drunk_driving',
    'using_phone', 'reckless_driving', 'other'
  )),
  severity text NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  confidence_score numeric(5,2) CHECK (confidence_score BETWEEN 0 AND 100),
  location text,
  latitude numeric(10,6),
  longitude numeric(10,6),
  camera_id uuid,
  evidence_url text,
  annotated_image_url text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'confirmed', 'dismissed', 'paid')),
  fine_amount numeric(10,2),
  officer_notes text,
  detected_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE violations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_violations" ON violations;
CREATE POLICY "select_own_violations" ON violations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_violations" ON violations;
CREATE POLICY "insert_own_violations" ON violations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_violations" ON violations;
CREATE POLICY "update_own_violations" ON violations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_violations" ON violations;
CREATE POLICY "delete_own_violations" ON violations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Vehicle sightings table
CREATE TABLE IF NOT EXISTS vehicle_sightings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  plate_number text,
  camera_id uuid,
  location text,
  latitude numeric(10,6),
  longitude numeric(10,6),
  image_url text,
  confidence_score numeric(5,2),
  detected_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicle_sightings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_sightings" ON vehicle_sightings;
CREATE POLICY "select_own_sightings" ON vehicle_sightings FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sightings" ON vehicle_sightings;
CREATE POLICY "insert_own_sightings" ON vehicle_sightings FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sightings" ON vehicle_sightings;
CREATE POLICY "update_own_sightings" ON vehicle_sightings FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sightings" ON vehicle_sightings;
CREATE POLICY "delete_own_sightings" ON vehicle_sightings FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Missing vehicles table
CREATE TABLE IF NOT EXISTS missing_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  plate_number text,
  make text,
  model text,
  color text,
  vehicle_type text,
  image_url text,
  last_seen_location text,
  last_seen_latitude numeric(10,6),
  last_seen_longitude numeric(10,6),
  last_seen_at timestamptz,
  report_date timestamptz DEFAULT now(),
  status text DEFAULT 'missing' CHECK (status IN ('missing', 'searching', 'recovered', 'closed')),
  recovered_at timestamptz,
  recovered_location text,
  officer_assigned uuid REFERENCES profiles(id),
  description text,
  contact_phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE missing_vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_missing" ON missing_vehicles;
CREATE POLICY "select_own_missing" ON missing_vehicles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_missing" ON missing_vehicles;
CREATE POLICY "insert_own_missing" ON missing_vehicles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_missing" ON missing_vehicles;
CREATE POLICY "update_own_missing" ON missing_vehicles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_missing" ON missing_vehicles;
CREATE POLICY "delete_own_missing" ON missing_vehicles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Accidents table
CREATE TABLE IF NOT EXISTS accidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  location text,
  latitude numeric(10,6),
  longitude numeric(10,6),
  severity text NOT NULL DEFAULT 'minor' CHECK (severity IN ('minor', 'moderate', 'major', 'fatal')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'responded', 'cleared', 'investigating')),
  vehicles_involved integer DEFAULT 1,
  injuries integer DEFAULT 0,
  fatalities integer DEFAULT 0,
  description text,
  image_url text,
  camera_id uuid,
  reported_at timestamptz DEFAULT now(),
  cleared_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE accidents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_accidents" ON accidents;
CREATE POLICY "select_own_accidents" ON accidents FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_accidents" ON accidents;
CREATE POLICY "insert_own_accidents" ON accidents FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_accidents" ON accidents;
CREATE POLICY "update_own_accidents" ON accidents FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_accidents" ON accidents;
CREATE POLICY "delete_own_accidents" ON accidents FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Traffic predictions table
CREATE TABLE IF NOT EXISTS traffic_predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  location text,
  latitude numeric(10,6),
  longitude numeric(10,6),
  predicted_congestion text CHECK (predicted_congestion IN ('low', 'moderate', 'high', 'severe')),
  confidence numeric(5,2),
  prediction_for timestamptz NOT NULL,
  factors jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE traffic_predictions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_predictions" ON traffic_predictions;
CREATE POLICY "select_own_predictions" ON traffic_predictions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_predictions" ON traffic_predictions;
CREATE POLICY "insert_own_predictions" ON traffic_predictions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_predictions" ON traffic_predictions;
CREATE POLICY "update_own_predictions" ON traffic_predictions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_predictions" ON traffic_predictions;
CREATE POLICY "delete_own_predictions" ON traffic_predictions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Road hazards table
CREATE TABLE IF NOT EXISTS road_hazards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  hazard_type text NOT NULL CHECK (hazard_type IN (
    'pothole', 'debris', 'flooding', 'construction', 'accident', 'landslide',
    'ice', 'fog', 'animal', 'other'
  )),
  location text,
  latitude numeric(10,6),
  longitude numeric(10,6),
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'false_alarm')),
  image_url text,
  detected_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE road_hazards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_hazards" ON road_hazards;
CREATE POLICY "select_own_hazards" ON road_hazards FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_hazards" ON road_hazards;
CREATE POLICY "insert_own_hazards" ON road_hazards FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_hazards" ON road_hazards;
CREATE POLICY "update_own_hazards" ON road_hazards FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_hazards" ON road_hazards;
CREATE POLICY "delete_own_hazards" ON road_hazards FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  report_type text CHECK (report_type IN (
    'violations_summary', 'traffic_analysis', 'missing_vehicle', 'accident_report',
    'system_audit', 'custom'
  )),
  description text,
  file_url text,
  date_from timestamptz,
  date_to timestamptz,
  parameters jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_reports" ON reports;
CREATE POLICY "select_own_reports" ON reports FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_reports" ON reports;
CREATE POLICY "insert_own_reports" ON reports FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_reports" ON reports;
CREATE POLICY "update_own_reports" ON reports FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_reports" ON reports;
CREATE POLICY "delete_own_reports" ON reports FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN (
    'violation', 'accident', 'alert', 'missing_vehicle', 'system', 'prediction'
  )),
  severity text DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'critical')),
  read boolean DEFAULT false,
  related_id uuid,
  related_type text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notifications" ON notifications;
CREATE POLICY "select_own_notifications" ON notifications FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_notifications" ON notifications;
CREATE POLICY "insert_own_notifications" ON notifications FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_notifications" ON notifications;
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_notifications" ON notifications;
CREATE POLICY "delete_own_notifications" ON notifications FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Camera nodes table
CREATE TABLE IF NOT EXISTS camera_nodes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location text,
  latitude numeric(10,6),
  longitude numeric(10,6),
  camera_type text CHECK (camera_type IN ('cctv', 'speed', 'anpr', 'thermal', 'drone')),
  status text DEFAULT 'online' CHECK (status IN ('online', 'offline', 'maintenance', 'error')),
  stream_url text,
  last_frame_url text,
  detection_enabled boolean DEFAULT true,
  coverage_radius numeric(10,2),
  installed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE camera_nodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_cameras" ON camera_nodes;
CREATE POLICY "select_own_cameras" ON camera_nodes FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_cameras" ON camera_nodes;
CREATE POLICY "insert_own_cameras" ON camera_nodes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_cameras" ON camera_nodes;
CREATE POLICY "update_own_cameras" ON camera_nodes FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_cameras" ON camera_nodes;
CREATE POLICY "delete_own_cameras" ON camera_nodes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_audits" ON audit_logs;
CREATE POLICY "select_own_audits" ON audit_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_audits" ON audit_logs;
CREATE POLICY "insert_own_audits" ON audit_logs FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_audits" ON audit_logs;
CREATE POLICY "update_own_audits" ON audit_logs FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_audits" ON audit_logs;
CREATE POLICY "delete_own_audits" ON audit_logs FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_violations_type ON violations(violation_type);
CREATE INDEX IF NOT EXISTS idx_violations_status ON violations(status);
CREATE INDEX IF NOT EXISTS idx_violations_detected ON violations(detected_at);
CREATE INDEX IF NOT EXISTS idx_violations_plate ON violations(plate_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_sightings_plate ON vehicle_sightings(plate_number);
CREATE INDEX IF NOT EXISTS idx_sightings_detected ON vehicle_sightings(detected_at);
CREATE INDEX IF NOT EXISTS idx_missing_status ON missing_vehicles(status);
CREATE INDEX IF NOT EXISTS idx_accidents_status ON accidents(status);
CREATE INDEX IF NOT EXISTS idx_accidents_severity ON accidents(severity);
CREATE INDEX IF NOT EXISTS idx_hazards_status ON road_hazards(status);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_cameras_status ON camera_nodes(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
