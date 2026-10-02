/**
 * Migration 010: Setup Supabase Row Level Security (RLS) Policies
 * Ensures public/anon can read published content and submit leads/orders,
 * while service_role retains full access across all tables.
 */

export const up = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType !== 'postgres') return;

  await query(`
    DO $$
    BEGIN
      -- Enable RLS explicitly on key tables
      ALTER TABLE IF EXISTS app_settings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS sys_configs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS articles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS travel_trips ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS product_prices ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS product_images ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS sys_leads ENABLE ROW LEVEL SECURITY;
      ALTER TABLE IF EXISTS admin_settings ENABLE ROW LEVEL SECURITY;

      -- 1. Public Read Policies
      DROP POLICY IF EXISTS "Public can view app_settings" ON app_settings;
      CREATE POLICY "Public can view app_settings" ON app_settings FOR SELECT TO public USING (true);

      DROP POLICY IF EXISTS "Public can view sys_configs" ON sys_configs;
      CREATE POLICY "Public can view sys_configs" ON sys_configs FOR SELECT TO public USING (true);

      DROP POLICY IF EXISTS "Public can view articles" ON articles;
      CREATE POLICY "Public can view articles" ON articles FOR SELECT TO public USING (is_published = true);

      DROP POLICY IF EXISTS "Public can view travel_trips" ON travel_trips;
      CREATE POLICY "Public can view travel_trips" ON travel_trips FOR SELECT TO public USING (is_active = true);

      DROP POLICY IF EXISTS "Public can view products" ON products;
      CREATE POLICY "Public can view products" ON products FOR SELECT TO public USING (is_active = true);

      DROP POLICY IF EXISTS "Public can view product_prices" ON product_prices;
      CREATE POLICY "Public can view product_prices" ON product_prices FOR SELECT TO public USING (true);

      DROP POLICY IF EXISTS "Public can view product_images" ON product_images;
      CREATE POLICY "Public can view product_images" ON product_images FOR SELECT TO public USING (true);

      -- 2. Public Insert Policies (Leads & Orders from landing page checkout)
      DROP POLICY IF EXISTS "Public can insert orders" ON orders;
      CREATE POLICY "Public can insert orders" ON orders FOR INSERT TO public WITH CHECK (true);

      DROP POLICY IF EXISTS "Public can insert leads" ON sys_leads;
      CREATE POLICY "Public can insert leads" ON sys_leads FOR INSERT TO public WITH CHECK (true);

      -- 3. Service Role Full Access (Admin backend operations)
      -- In Supabase, service_role bypasses RLS by default, but explicit policies ensure consistency
      DROP POLICY IF EXISTS "Service role full access app_settings" ON app_settings;
      CREATE POLICY "Service role full access app_settings" ON app_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

      DROP POLICY IF EXISTS "Service role full access articles" ON articles;
      CREATE POLICY "Service role full access articles" ON articles FOR ALL TO service_role USING (true) WITH CHECK (true);

      DROP POLICY IF EXISTS "Service role full access travel_trips" ON travel_trips;
      CREATE POLICY "Service role full access travel_trips" ON travel_trips FOR ALL TO service_role USING (true) WITH CHECK (true);

      DROP POLICY IF EXISTS "Service role full access orders" ON orders;
      CREATE POLICY "Service role full access orders" ON orders FOR ALL TO service_role USING (true) WITH CHECK (true);

      DROP POLICY IF EXISTS "Service role full access admin_settings" ON admin_settings;
      CREATE POLICY "Service role full access admin_settings" ON admin_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

      DROP POLICY IF EXISTS "Service role full access products" ON products;
      CREATE POLICY "Service role full access products" ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

      DROP POLICY IF EXISTS "Service role full access product_prices" ON product_prices;
      CREATE POLICY "Service role full access product_prices" ON product_prices FOR ALL TO service_role USING (true) WITH CHECK (true);

      DROP POLICY IF EXISTS "Service role full access product_images" ON product_images;
      CREATE POLICY "Service role full access product_images" ON product_images FOR ALL TO service_role USING (true) WITH CHECK (true);
    END $$;
  `);
};

export const down = async ({ query, getDbType }) => {
  const dbType = getDbType();
  if (dbType !== 'postgres') return;

  await query(`
    DO $$
    BEGIN
      DROP POLICY IF EXISTS "Public can view app_settings" ON app_settings;
      DROP POLICY IF EXISTS "Public can view sys_configs" ON sys_configs;
      DROP POLICY IF EXISTS "Public can view articles" ON articles;
      DROP POLICY IF EXISTS "Public can view travel_trips" ON travel_trips;
      DROP POLICY IF EXISTS "Public can view products" ON products;
      DROP POLICY IF EXISTS "Public can view product_prices" ON product_prices;
      DROP POLICY IF EXISTS "Public can view product_images" ON product_images;
      DROP POLICY IF EXISTS "Public can insert orders" ON orders;
      DROP POLICY IF EXISTS "Public can insert leads" ON sys_leads;
    END $$;
  `);
};
