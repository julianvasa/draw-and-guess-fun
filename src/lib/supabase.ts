import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Define database types
export type Room = {
  id: string;
  created_at?: string;
  current_word?: string;
  current_drawing_user?: string;
  canvas_data?: any;
};

export type RoomUser = {
  id?: string;
  room_id: string;
  user_id: string;
  username: string;
  points: number;
  created_at?: string;
};