/*
# AEGIS Seed Data

1. Overview
Inserts realistic demo data for the AEGIS traffic intelligence platform.
Includes vehicles, violations, sightings, missing vehicles, accidents, cameras, notifications, and traffic predictions.

2. Data Coverage
- 10 registered vehicles
- 20 traffic violations
- 15 vehicle sightings
- 5 missing vehicles
- 6 accidents
- 8 camera nodes
- 10 notifications
- 5 traffic predictions
- 6 road hazards

3. Important Notes
- All data is owned by the demo user (00000000-0000-0000-0000-000000000001).
- Timestamps are generated dynamically relative to now().
*/

-- Camera nodes
INSERT INTO camera_nodes (user_id, name, location, latitude, longitude, camera_type, status, coverage_radius, installed_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Cam-01 Main Street', 'Main Street & 1st Ave', 40.7128, -74.0060, 'cctv', 'online', 100.0, now() - interval '2 years'),
  ('00000000-0000-0000-0000-000000000001', 'Cam-02 Highway 95', 'Highway 95 Mile 42', 40.7580, -73.9855, 'speed', 'online', 150.0, now() - interval '1 year'),
  ('00000000-0000-0000-0000-000000000001', 'Cam-03 ANPR Bridge', 'Brooklyn Bridge South', 40.7061, -73.9969, 'anpr', 'online', 80.0, now() - interval '18 months'),
  ('00000000-0000-0000-0000-000000000001', 'Cam-04 Downtown', '5th Ave & 42nd St', 40.7549, -73.9840, 'cctv', 'online', 120.0, now() - interval '3 years'),
  ('00000000-0000-0000-0000-000000000001', 'Cam-05 School Zone', 'Central Park West', 40.7829, -73.9654, 'thermal', 'maintenance', 60.0, now() - interval '8 months'),
  ('00000000-0000-0000-0000-000000000001', 'Cam-06 Industrial', 'Port Authority Terminal', 40.7614, -74.0051, 'cctv', 'online', 200.0, now() - interval '1 year'),
  ('00000000-0000-0000-0000-000000000001', 'Cam-07 Drone Patrol', 'Airborne Sector 7', 40.7300, -73.9900, 'drone', 'online', 300.0, now() - interval '6 months'),
  ('00000000-0000-0000-0000-000000000001', 'Cam-08 Highway North', 'I-278 Northbound', 40.6892, -73.9442, 'speed', 'offline', 140.0, now() - interval '2 years');

-- Vehicles
INSERT INTO vehicles (user_id, plate_number, make, model, color, vehicle_type, year, owner_name, owner_phone, registration_status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NYC-001A', 'Toyota', 'Camry', 'Silver', 'car', 2021, 'John Smith', '555-0101', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-002B', 'Honda', 'Accord', 'Black', 'car', 2020, 'Sarah Johnson', '555-0102', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-003C', 'Ford', 'F-150', 'White', 'truck', 2022, 'Mike Davis', '555-0103', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-004D', 'BMW', 'X5', 'Blue', 'suv', 2023, 'Emily Chen', '555-0104', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-005E', 'Yamaha', 'MT-07', 'Red', 'motorcycle', 2022, 'Alex Rivera', '555-0105', 'stolen'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-006F', 'Toyota', 'Corolla', 'Gray', 'car', 2019, 'Lisa Park', '555-0106', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-007G', 'Mercedes', 'Sprinter', 'White', 'van', 2021, 'Transit Co', '555-0107', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-008H', 'Honda', 'Civic', 'Green', 'car', 2020, 'David Kim', '555-0108', 'suspended'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-009I', 'Volvo', 'XC90', 'Black', 'suv', 2023, 'Rachel Green', '555-0109', 'active'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-010J', 'Kawasaki', 'Ninja', 'Black', 'motorcycle', 2023, 'Tom Wilson', '555-0110', 'active');

-- Violations
INSERT INTO violations (user_id, plate_number, violation_type, severity, confidence_score, location, latitude, longitude, camera_id, status, fine_amount, detected_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NYC-001A', 'speeding', 'high', 94.50, 'Main Street & 1st Ave', 40.7128, -74.0060, (SELECT id FROM camera_nodes WHERE name = 'Cam-01 Main Street'), 'pending', 250.00, now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-002B', 'red_light', 'critical', 98.20, '5th Ave & 42nd St', 40.7549, -73.9840, (SELECT id FROM camera_nodes WHERE name = 'Cam-04 Downtown'), 'confirmed', 150.00, now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-003C', 'illegal_parking', 'medium', 87.30, 'Port Authority Terminal', 40.7614, -74.0051, (SELECT id FROM camera_nodes WHERE name = 'Cam-06 Industrial'), 'pending', 75.00, now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-005E', 'no_helmet', 'high', 92.70, 'Brooklyn Bridge South', 40.7061, -73.9969, (SELECT id FROM camera_nodes WHERE name = 'Cam-03 ANPR Bridge'), 'confirmed', 200.00, now() - interval '1 hour'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-006F', 'wrong_side', 'critical', 96.80, 'Main Street & 1st Ave', 40.7128, -74.0060, (SELECT id FROM camera_nodes WHERE name = 'Cam-01 Main Street'), 'pending', 300.00, now() - interval '3 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-008H', 'drunk_driving', 'critical', 99.10, 'Highway 95 Mile 42', 40.7580, -73.9855, (SELECT id FROM camera_nodes WHERE name = 'Cam-02 Highway 95'), 'reviewed', 500.00, now() - interval '8 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-001A', 'stop_line', 'medium', 89.40, '5th Ave & 42nd St', 40.7549, -73.9840, (SELECT id FROM camera_nodes WHERE name = 'Cam-04 Downtown'), 'pending', 100.00, now() - interval '12 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-010J', 'triple_riding', 'high', 91.50, 'Brooklyn Bridge South', 40.7061, -73.9969, (SELECT id FROM camera_nodes WHERE name = 'Cam-03 ANPR Bridge'), 'confirmed', 180.00, now() - interval '5 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-004D', 'using_phone', 'medium', 85.60, 'Highway 95 Mile 42', 40.7580, -73.9855, (SELECT id FROM camera_nodes WHERE name = 'Cam-02 Highway 95'), 'pending', 125.00, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-007G', 'overloading', 'high', 93.20, 'Port Authority Terminal', 40.7614, -74.0051, (SELECT id FROM camera_nodes WHERE name = 'Cam-06 Industrial'), 'reviewed', 350.00, now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-002B', 'reckless_driving', 'critical', 97.50, 'Main Street & 1st Ave', 40.7128, -74.0060, (SELECT id FROM camera_nodes WHERE name = 'Cam-01 Main Street'), 'confirmed', 450.00, now() - interval '3 days'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-009I', 'speeding', 'high', 95.80, 'Highway 95 Mile 42', 40.7580, -73.9855, (SELECT id FROM camera_nodes WHERE name = 'Cam-02 Highway 95'), 'pending', 275.00, now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-006F', 'no_seatbelt', 'medium', 88.30, '5th Ave & 42nd St', 40.7549, -73.9840, (SELECT id FROM camera_nodes WHERE name = 'Cam-04 Downtown'), 'pending', 90.00, now() - interval '10 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-003C', 'red_light', 'high', 94.10, 'Brooklyn Bridge South', 40.7061, -73.9969, (SELECT id FROM camera_nodes WHERE name = 'Cam-03 ANPR Bridge'), 'confirmed', 150.00, now() - interval '15 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-005E', 'wrong_side', 'high', 90.20, 'Main Street & 1st Ave', 40.7128, -74.0060, (SELECT id FROM camera_nodes WHERE name = 'Cam-01 Main Street'), 'pending', 220.00, now() - interval '18 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-001A', 'illegal_parking', 'low', 82.50, 'Port Authority Terminal', 40.7614, -74.0051, (SELECT id FROM camera_nodes WHERE name = 'Cam-06 Industrial'), 'dismissed', 50.00, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-008H', 'speeding', 'high', 96.40, 'Highway 95 Mile 42', 40.7580, -73.9855, (SELECT id FROM camera_nodes WHERE name = 'Cam-02 Highway 95'), 'confirmed', 300.00, now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-010J', 'no_helmet', 'high', 93.60, 'Brooklyn Bridge South', 40.7061, -73.9969, (SELECT id FROM camera_nodes WHERE name = 'Cam-03 ANPR Bridge'), 'pending', 200.00, now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-004D', 'reckless_driving', 'critical', 98.70, '5th Ave & 42nd St', 40.7549, -73.9840, (SELECT id FROM camera_nodes WHERE name = 'Cam-04 Downtown'), 'confirmed', 500.00, now() - interval '5 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-007G', 'stop_line', 'medium', 87.80, 'Main Street & 1st Ave', 40.7128, -74.0060, (SELECT id FROM camera_nodes WHERE name = 'Cam-01 Main Street'), 'pending', 110.00, now() - interval '7 hours');

-- Vehicle sightings
INSERT INTO vehicle_sightings (user_id, plate_number, location, latitude, longitude, confidence_score, detected_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NYC-001A', 'Main Street & 1st Ave', 40.7128, -74.0060, 94.50, now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-002B', '5th Ave & 42nd St', 40.7549, -73.9840, 98.20, now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-003C', 'Port Authority Terminal', 40.7614, -74.0051, 87.30, now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-005E', 'Brooklyn Bridge South', 40.7061, -73.9969, 92.70, now() - interval '1 hour'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-006F', 'Main Street & 1st Ave', 40.7128, -74.0060, 96.80, now() - interval '3 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-008H', 'Highway 95 Mile 42', 40.7580, -73.9855, 99.10, now() - interval '8 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-001A', '5th Ave & 42nd St', 40.7549, -73.9840, 89.40, now() - interval '12 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-010J', 'Brooklyn Bridge South', 40.7061, -73.9969, 91.50, now() - interval '5 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-004D', 'Highway 95 Mile 42', 40.7580, -73.9855, 85.60, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-007G', 'Port Authority Terminal', 40.7614, -74.0051, 93.20, now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-002B', 'Main Street & 1st Ave', 40.7128, -74.0060, 97.50, now() - interval '3 days'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-009I', 'Highway 95 Mile 42', 40.7580, -73.9855, 95.80, now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-006F', '5th Ave & 42nd St', 40.7549, -73.9840, 88.30, now() - interval '10 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-003C', 'Brooklyn Bridge South', 40.7061, -73.9969, 94.10, now() - interval '15 hours'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-005E', 'Main Street & 1st Ave', 40.7128, -74.0060, 90.20, now() - interval '18 hours');

-- Missing vehicles
INSERT INTO missing_vehicles (user_id, plate_number, make, model, color, vehicle_type, last_seen_location, last_seen_latitude, last_seen_longitude, last_seen_at, status, description, contact_phone) VALUES
  ('00000000-0000-0000-0000-000000000001', 'NYC-005E', 'Yamaha', 'MT-07', 'Red', 'motorcycle', 'Brooklyn Bridge South', 40.7061, -73.9969, now() - interval '3 days', 'missing', 'Stolen from parking garage. Red Yamaha MT-07 with black saddle bags.', '555-0105'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-008H', 'Honda', 'Civic', 'Green', 'car', 'Highway 95 Mile 42', 40.7580, -73.9855, now() - interval '5 days', 'searching', 'License suspended. Vehicle seen fleeing traffic stop.', '555-0108'),
  ('00000000-0000-0000-0000-000000000001', 'ABC-1234', 'Ford', 'Mustang', 'Yellow', 'car', '5th Ave & 42nd St', 40.7549, -73.9840, now() - interval '1 day', 'missing', 'Yellow Mustang GT with racing stripes. Taken from valet parking.', '555-0200'),
  ('00000000-0000-0000-0000-000000000001', 'XYZ-9876', 'Tesla', 'Model 3', 'White', 'car', 'Port Authority Terminal', 40.7614, -74.0051, now() - interval '2 days', 'missing', 'White Tesla Model 3. Autopilot enabled last known location.', '555-0300'),
  ('00000000-0000-0000-0000-000000000001', 'NYC-001A', 'Toyota', 'Camry', 'Silver', 'car', 'Main Street & 1st Ave', 40.7128, -74.0060, now() - interval '7 days', 'recovered', 'Recovered from impound lot. Owner notified.', '555-0101');

-- Accidents
INSERT INTO accidents (user_id, location, latitude, longitude, severity, status, vehicles_involved, injuries, fatalities, description, reported_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Main Street & 1st Ave', 40.7128, -74.0060, 'minor', 'cleared', 2, 0, 0, 'Rear-end collision at traffic light. Minor damage, no injuries.', now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000001', 'Highway 95 Mile 42', 40.7580, -73.9855, 'major', 'responded', 3, 2, 0, 'Multi-vehicle pileup. Two injured, emergency services dispatched.', now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000001', 'Brooklyn Bridge South', 40.7061, -73.9969, 'fatal', 'investigating', 2, 1, 1, 'Head-on collision. One fatality, one critical injury. Under investigation.', now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', '5th Ave & 42nd St', 40.7549, -73.9840, 'minor', 'cleared', 1, 0, 0, 'Vehicle struck pedestrian crosswalk signal. No injuries.', now() - interval '8 hours'),
  ('00000000-0000-0000-0000-000000000001', 'Port Authority Terminal', 40.7614, -74.0051, 'moderate', 'responded', 2, 1, 0, 'Side-swipe collision in parking lot. One driver injured.', now() - interval '10 hours'),
  ('00000000-0000-0000-0000-000000000001', 'Central Park West', 40.7829, -73.9654, 'minor', 'active', 1, 0, 0, 'Vehicle struck tree branch. No injuries, vehicle damaged.', now() - interval '1 hour');

-- Notifications
INSERT INTO notifications (user_id, title, message, type, severity, read, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Speed Violation Detected', 'Vehicle NYC-001A exceeded speed limit at Main Street. Confidence: 94%', 'violation', 'warning', false, now() - interval '2 hours'),
  ('00000000-0000-0000-0000-000000000001', 'Red Light Violation', 'Vehicle NYC-002B ran red light at 5th Ave & 42nd St. Confidence: 98%', 'violation', 'critical', false, now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000001', 'Missing Vehicle Alert', 'Yamaha MT-07 (NYC-005E) reported missing. Last seen Brooklyn Bridge.', 'missing_vehicle', 'critical', false, now() - interval '3 days'),
  ('00000000-0000-0000-0000-000000000001', 'Accident Reported', 'Major accident on Highway 95. Emergency services dispatched.', 'accident', 'critical', false, now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000001', 'Camera Offline', 'Camera Cam-08 Highway North is offline. Maintenance required.', 'alert', 'warning', false, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000001', 'Traffic Prediction', 'High congestion predicted for 5th Ave at 6:00 PM. Confidence: 87%', 'prediction', 'info', true, now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', 'New Vehicle Sighting', 'Vehicle NYC-009I spotted at Highway 95. Confidence: 96%', 'alert', 'info', false, now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', 'Hazard Detected', 'Road debris detected on I-278 Northbound. Crew dispatched.', 'alert', 'warning', false, now() - interval '3 hours'),
  ('00000000-0000-0000-0000-000000000001', 'System Update', 'AEGIS v2.1 deployed successfully. New features: accident detection.', 'system', 'info', true, now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000001', 'Vehicle Recovered', 'Toyota Camry (NYC-001A) recovered from impound lot.', 'missing_vehicle', 'info', true, now() - interval '7 days');

-- Traffic predictions
INSERT INTO traffic_predictions (user_id, location, latitude, longitude, predicted_congestion, confidence, prediction_for, factors) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Main Street & 1st Ave', 40.7128, -74.0060, 'high', 87.50, now() + interval '1 hour', '{"weather": "rain", "events": ["concert"], "historical": "high"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Highway 95 Mile 42', 40.7580, -73.9855, 'severe', 92.30, now() + interval '2 hours', '{"weather": "clear", "events": [], "historical": "severe"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', '5th Ave & 42nd St', 40.7549, -73.9840, 'moderate', 78.60, now() + interval '3 hours', '{"weather": "cloudy", "events": [], "historical": "moderate"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Brooklyn Bridge South', 40.7061, -73.9969, 'high', 85.40, now() + interval '1 hour', '{"weather": "rain", "events": ["sports"], "historical": "high"}'::jsonb),
  ('00000000-0000-0000-0000-000000000001', 'Port Authority Terminal', 40.7614, -74.0051, 'moderate', 72.80, now() + interval '4 hours', '{"weather": "clear", "events": [], "historical": "low"}'::jsonb);

-- Road hazards
INSERT INTO road_hazards (user_id, hazard_type, location, latitude, longitude, severity, status, detected_at) VALUES
  ('00000000-0000-0000-0000-000000000001', 'pothole', 'Main Street near 3rd Ave', 40.7150, -74.0050, 'medium', 'active', now() - interval '2 days'),
  ('00000000-0000-0000-0000-000000000001', 'debris', 'Highway 95 Mile 43', 40.7590, -73.9860, 'high', 'active', now() - interval '4 hours'),
  ('00000000-0000-0000-0000-000000000001', 'flooding', 'Brooklyn Bridge ramp', 40.7050, -73.9980, 'critical', 'active', now() - interval '6 hours'),
  ('00000000-0000-0000-0000-000000000001', 'construction', '5th Ave between 40th-45th', 40.7530, -73.9830, 'medium', 'active', now() - interval '1 day'),
  ('00000000-0000-0000-0000-000000000001', 'accident', 'I-278 Northbound', 40.6880, -73.9430, 'critical', 'resolved', now() - interval '3 days'),
  ('00000000-0000-0000-0000-000000000001', 'fog', 'Central Park West', 40.7830, -73.9660, 'low', 'resolved', now() - interval '5 hours');
