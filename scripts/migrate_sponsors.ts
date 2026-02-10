
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sponsorsToMigrate = [
  {
    name: 'SmartPix Media',
    website_url: 'https://www.facebook.com/smartpixmediaofficial',
    imagePath: 'public/images/spm_icon.png',
    display_order: 1
  },
  {
    name: 'Kappo',
    website_url: 'https://kappo.in',
    imagePath: 'public/images/kappo1.png',
    display_order: 2
  },
  {
    name: 'Heritage Record Room',
    website_url: null,
    imagePath: 'public/images/heritage.png',
    display_order: 3
  },
  {
    name: 'Cuba Libre',
    website_url: 'https://www.instagram.com/cubalibre.in/',
    imagePath: 'public/images/cuba.jpg',
    display_order: 4
  }
];

async function migrate() {
  console.log('Starting sponsor migration...');

  for (const sponsor of sponsorsToMigrate) {
    console.log(`Processing ${sponsor.name}...`);

    try {
      // 1. Read file
      const filePath = path.resolve(process.cwd(), sponsor.imagePath);
      if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        continue;
      }
      const fileBuffer = fs.readFileSync(filePath);
      const fileExt = path.extname(filePath).substring(1); // png, jpg
      const fileName = `${Date.now()}_${path.basename(filePath)}`;
      
      // Determine content type
      const contentType = fileExt === 'png' ? 'image/png' : 'image/jpeg';

      // 2. Upload to Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('sponsor-logos')
        .upload(fileName, fileBuffer, {
          contentType: contentType,
          upsert: true
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // 3. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sponsor-logos')
        .getPublicUrl(fileName);

      // 4. Insert into DB
      const { error: insertError } = await supabase
          .from('sponsors')
          .insert({
            name: sponsor.name,
            website_url: sponsor.website_url,
            logo_url: publicUrl,
            display_order: sponsor.display_order
          });

      if (insertError) {
        throw new Error(`DB Insert failed: ${insertError.message}`);
      }

      console.log(`✅ Successfully migrated: ${sponsor.name}`);

    } catch (err: any) {
      console.error(`❌ Failed to migrate ${sponsor.name}:`, err.message);
    }
  }

  console.log('Migration complete.');
}

migrate();
