import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function testConnection() {
  console.log('Testing API connection...');
  
  // Try to fetch from homepage_settings
  const { data, error } = await supabase
    .from('homepage_settings')
    .select('*')
    .limit(1);

  if (error) {
    console.error('API Connection Failed:', error.message);
  } else {
    console.log('API Connection Successful!');
    console.log('Accessed table: homepage_settings');
    console.log('Data sample:', data);
  }

  // Try to fetch from homepage_video_history
  const { data: history, error: historyError } = await supabase
    .from('homepage_video_history')
    .select('*')
    .limit(1);
    
  if (!historyError) {
    console.log('Accessed table: homepage_video_history');
  }
}

testConnection();
