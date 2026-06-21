import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          avatar_url: string | null;
          role: string;
          department: string | null;
          badge_number: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      vehicles: {
        Row: {
          id: string;
          plate_number: string;
          make: string | null;
          model: string | null;
          color: string | null;
          vehicle_type: string | null;
          year: number | null;
          owner_name: string | null;
          owner_phone: string | null;
          registration_status: string;
          created_at: string;
        };
      };
      violations: {
        Row: {
          id: string;
          plate_number: string | null;
          violation_type: string;
          severity: string;
          confidence_score: number | null;
          location: string | null;
          latitude: number | null;
          longitude: number | null;
          status: string;
          fine_amount: number | null;
          detected_at: string;
          created_at: string;
        };
      };
      missing_vehicles: {
        Row: {
          id: string;
          plate_number: string | null;
          make: string | null;
          model: string | null;
          color: string | null;
          vehicle_type: string | null;
          last_seen_location: string | null;
          last_seen_at: string | null;
          status: string;
          description: string | null;
          contact_phone: string | null;
          created_at: string;
        };
      };
      accidents: {
        Row: {
          id: string;
          location: string | null;
          severity: string;
          status: string;
          vehicles_involved: number;
          injuries: number;
          fatalities: number;
          description: string | null;
          reported_at: string;
          created_at: string;
        };
      };
      camera_nodes: {
        Row: {
          id: string;
          name: string;
          location: string | null;
          camera_type: string | null;
          status: string;
          coverage_radius: number | null;
          created_at: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: string;
          severity: string;
          read: boolean;
          created_at: string;
        };
      };
    };
  };
};
