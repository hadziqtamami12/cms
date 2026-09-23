/**
 * Initial Database Seeds
 * Seeds 50 modular themes across 5 industries, navigation presets, and default configuration
 */

import { generateLicenseKey } from '../../../services/licenseService.js';

export const seed = async ({ query, getDbType }) => {
  console.log('  Seeding 50 Theme metadata records...');
  
  const industries = [
    {
      id: 'automotive',
      name: 'Rental & Otomotif',
      themes: [
        { id: 'fleet-grid', name: 'Fleet Showcase Grid' },
        { id: 'booking-bar-hero', name: 'Booking Reservation Bar' },
        { id: 'luxury-chauffeur', name: 'Luxury VIP Chauffeur' },
        { id: 'minimalist-rent', name: 'Minimalist Fast Rent' },
        { id: 'daily-express', name: 'Daily Express Rental' },
        { id: 'offroad-adventure', name: 'Offroad & Tour 4x4' },
        { id: 'executive-van', name: 'Executive Van & Shuttle' },
        { id: 'eco-electric', name: 'Eco Electric EV Fleet' },
        { id: 'airport-shuttle', name: 'Airport Express Transfer' },
        { id: 'bike-scooter', name: 'Urban Bike & Scooter' },
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-Commerce & Retail',
      themes: [
        { id: 'direct-checkout', name: 'Direct Funnel Checkout' },
        { id: 'flash-sale-modern', name: 'Flash Sale Modern' },
        { id: 'brand-catalog', name: 'Brand Product Catalog' },
        { id: 'storytelling-artisan', name: 'Artisan Storytelling' },
        { id: 'minimal-boutique', name: 'Editorial Minimal Boutique' },
        { id: 'tech-gadget', name: 'Tech Gadget Specs' },
        { id: 'organic-grocery', name: 'Fresh Organic Grocery' },
        { id: 'wholesale-b2b', name: 'B2B Wholesale Portal' },
        { id: 'fashion-lookbook', name: 'Fashion Lookbook Grid' },
        { id: 'single-product', name: 'Single Product Spotlight' },
      ]
    },
    {
      id: 'fnb',
      name: 'F&B & Kuliner',
      themes: [
        { id: 'bistro-fine-dining', name: 'Fine Dining & Bistro' },
        { id: 'coffee-roastery', name: 'Artisan Coffee Roastery' },
        { id: 'fast-casual', name: 'Fast Casual Burger & Bites' },
        { id: 'artisan-bakery', name: 'Pastry & Artisan Bakery' },
        { id: 'cloud-kitchen', name: 'Cloud Kitchen Delivery Hub' },
        { id: 'japanese-omakase', name: 'Authentic Japanese Omakase' },
        { id: 'street-food-hub', name: 'Modern Street Food Hub' },
        { id: 'catering-banquet', name: 'Catering & Banquet Hall' },
        { id: 'juice-health-bar', name: 'Cold-Pressed Juice Bar' },
        { id: 'dessert-parlour', name: 'Gelato & Dessert Parlour' },
      ]
    },
    {
      id: 'services',
      name: 'Jasa Profesional & Layanan Lokal',
      themes: [
        { id: 'legal-law-firm', name: 'Advocate & Law Firm' },
        { id: 'tech-consulting', name: 'Enterprise IT Consulting' },
        { id: 'accounting-tax', name: 'Tax & Accounting Advisory' },
        { id: 'auto-repair', name: 'Auto Repair & Detailing Lab' },
        { id: 'beauty-salon-spa', name: 'Aesthetic Clinic & Luxury Spa' },
        { id: 'medical-dental', name: 'Dental Care & Health Clinic' },
        { id: 'home-services-hvac', name: 'HVAC & Home Repair Express' },
        { id: 'creative-agency', name: 'Creative Studio & Branding' },
        { id: 'security-safety', name: 'Corporate Security & Guard' },
        { id: 'fitness-personal-trainer', name: 'Gym & Elite Fitness Studio' },
      ]
    },
    {
      id: 'realestate',
      name: 'Properti & Real Estate',
      themes: [
        { id: 'luxury-villa-penthouse', name: 'Luxury Villa & Penthouse' },
        { id: 'suburban-housing', name: 'Suburban Housing Cluster' },
        { id: 'commercial-leasing', name: 'Grade-A Office Leasing' },
        { id: 'high-rise-apartment', name: 'Metropolitan High-Rise' },
        { id: 'land-plots', name: 'Land & Investment Plots' },
        { id: 'co-living-boarding', name: 'Modern Co-Living Residence' },
        { id: 'modern-minimalist-home', name: 'Scandinavian Minimalist Home' },
        { id: 'smart-home-residence', name: 'Smart IoT Eco Residences' },
        { id: 'beachfront-resort', name: 'Tropical Beachfront Resort' },
        { id: 'industrial-warehouse', name: 'Logistics Warehouse Hub' },
      ]
    }
  ];

  const dbType = getDbType();
  for (const ind of industries) {
    for (const th of ind.themes) {
      if (dbType === 'postgres') {
        await query(`
          INSERT INTO sys_themes (id, industry, name, description, is_active)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (id) DO UPDATE SET name = $3;
        `, [th.id, ind.id, th.name, `Preset tema untuk industri ${ind.name}`, th.id === 'fleet-grid']);
      } else if (dbType === 'mysql') {
        await query(`
          INSERT INTO sys_themes (id, industry, name, description, is_active)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE name = ?;
        `, [th.id, ind.id, th.name, `Preset tema untuk industri ${ind.name}`, th.id === 'fleet-grid', th.name]);
      }
    }
  }

  // Generate a starter 1-year license for instant readiness
  const sampleLicense = generateLicenseKey({ clientName: 'STARTER_ENTERPRISE', type: 'yearly' });
  console.log(`  Initial 1-Year Master License Key Seeded: ${sampleLicense.licenseKey}`);
};

export default { seed };
