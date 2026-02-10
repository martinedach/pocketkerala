import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function setupStorage() {
  console.log('Setting up storage bucket: sponsor-logos ...');

  const { data, error } = await supabase
    .storage
    .createBucket('sponsor-logos', {
      public: true,
      fileSizeLimit: 1048576, // 1MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp']
    });

  if (error) {
    if (error.message.includes('already exists')) {
      console.log('✅ Bucket "sponsor-logos" already exists.');
    } else {
      console.error('❌ Failed to create bucket:', error.message);
    }
  } else {
    console.log('✅ Successfully created bucket: sponsor-logos');
    console.log('Data:', data);
  }
}

setupStorage();
