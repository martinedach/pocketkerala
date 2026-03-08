import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local or .env
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key to bypass RLS for seeding, or Anon if RLS allows inserts.
// Since Admin requires Auth, using the service role is usually best for scripts.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const MOCK_DESIGNS = [
  { id: "design-1", name: "Green", description: "Green design", image: "/images/green.PNG" },
  { id: "design-2", name: "Pink", description: "Pink design", image: "/images/pink.PNG" },
  { id: "design-3", name: "Yellow", description: "Yellow design", image: "/images/yellow.PNG" },
];

const SIZES = ["S", "M", "L", "XL", "XXL"];
const PRICE = 899;

async function seedData() {
  console.log('Seeding shop data...');

  // 1. Create Category
  console.log('Creating category...');
  const { data: category, error: catError } = await supabase
    .from('shop_categories')
    .upsert(
      { name: 'Apparel', slug: 'apparel', description: 'Clothing and wearables', sort_order: 1, is_active: true },
      { onConflict: 'slug' }
    )
    .select()
    .single();

  if (catError) {
    console.error('Category error:', catError);
    return;
  }
  console.log('Category created:', category.id);

  // 2. Create Product
  console.log('Creating product...');
  const { data: product, error: prodError } = await supabase
    .from('shop_products')
    .upsert(
      { 
        category_id: category.id, 
        name: 'Pocket Kerala T-Shirt', 
        slug: 'pocket-kerala-t-shirt', 
        description: 'Premium cotton t-shirt with exclusive Kerala-inspired designs. Unisex fit.', 
        is_active: true 
      },
      { onConflict: 'slug' }
    )
    .select()
    .single();

  if (prodError) {
    console.error('Product error:', prodError);
    return;
  }
  console.log('Product created:', product.id);

  // 3. Create Variants (Combinations of Designs and Sizes)
  console.log('Creating variants...');
  const variantsToInsert = [];

  for (const design of MOCK_DESIGNS) {
    for (const size of SIZES) {
      variantsToInsert.push({
        product_id: product.id,
        name: `${design.name} - ${size}`,
        size: size,
        design: design.name,
        price: PRICE,
        stock_quantity: 100, // Default stock
        sku: `PK-TSHIRT-${design.name.toUpperCase().substring(0, 3)}-${size}`,
        image_url: design.image,
        is_active: true
      });
    }
  }

  // Delete existing variants for this product to avoid duplicates if run multiple times
  await supabase.from('shop_product_variants').delete().eq('product_id', product.id);

  const { data: variants, error: varError } = await supabase
    .from('shop_product_variants')
    .insert(variantsToInsert)
    .select();

  if (varError) {
    console.error('Variant error:', varError);
    return;
  }

  console.log(`Successfully inserted ${variants.length} variants!`);
  console.log('Seeding complete!');
  process.exit(0);
}

seedData();
