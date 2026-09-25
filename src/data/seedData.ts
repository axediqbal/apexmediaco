import { ProductItem } from '@/types';

export const SEED_PRODUCTS: ProductItem[] = [
  {
    id: 'prod_obsidian_apparel',
    name: 'APEX Obsidian Executive Apparel Kit',
    slug: 'apex-obsidian-executive-apparel-kit',
    tagline: 'Minimalist aerodynamic outerwear & bamboo-fiber knitwear engineered for leadership summits.',
    description: 'Precision-crafted for executive delegations and high-stakes client pitches. The Obsidian Kit features a weather-resistant bonded matte softshell jacket with magnetic closure storm flaps, two 320GSM ultra-dense organic bamboo crewneck tees, and a CNC-milled Grade 5 titanium APEX emblem lapel pin. Finished with tonal micro-embossed agency branding.',
    price: 340,
    category: 'Apparel',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80'
    ],
    variants: [
      { id: 'size', name: 'Size', options: ['Small', 'Medium', 'Large', 'X-Large', '2X-Large'] },
      { id: 'colorway', name: 'Colorway', options: ['Obsidian Stealth', 'Cobalt Monolith'] },
      { id: 'cut', name: 'Fit Style', options: ['Tailored Slim', 'Relaxed Executive'] }
    ],
    features: [
      'Bonded 3-layer weatherproof breathable membrane (10,000mm)',
      'Subtle silicone debossed APEX coordinates on left forearm',
      'Laser-cut interior media pocket with RFID blocking lining',
      'Includes custom matte black rigid magnetic keepsake presentation box'
    ],
    stock: 42,
    rating: 4.95,
    reviewsCount: 38,
    featured: true,
    badge: 'Executive Tier',
    sku: 'APX-APP-001',
    leadTime: '3-5 Business Days'
  },
  {
    id: 'prod_keynote_event_system',
    name: 'Keynote Event Stage & Architectural Signage System',
    slug: 'keynote-event-stage-architectural-signage',
    tagline: 'Modular acoustic backlit pylons and aluminum presentation stage collateral for national conferences.',
    description: 'Turn any hotel ballroom or convention center into an immersive APEX-level branded environment. Includes two 8ft tension-fabric backlit monolithic pylons, a custom laser-engraved lectern surround with wireless device charging surface, and 250 heavyweight matte NFC-enabled smart VIP badges with silicone woven lanyards.',
    price: 1850,
    category: 'Event & Signage',
    images: [
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80'
    ],
    variants: [
      { id: 'frame_finish', name: 'Anodized Finish', options: ['Matte Stealth Black', 'Brushed Cobalt Titanium'] },
      { id: 'lighting', name: 'Illumination', options: ['Internal Warm White (3000K)', 'Programmable RGBW Dynamic'] }
    ],
    features: [
      'Tool-free rapid 15-minute assembly with internal lock system',
      'Color-calibrated dye-sublimation blockout fabric graphics',
      'Wheeled airline-compliant military-grade flight travel cases',
      'Includes remote pre-flight production graphic alignment by APEX designers'
    ],
    stock: 14,
    rating: 4.98,
    reviewsCount: 22,
    featured: true,
    badge: 'Enterprise Flagship',
    sku: 'APX-EVT-010',
    leadTime: '7-10 Business Days'
  },
  {
    id: 'prod_vip_onboarding_vault',
    name: 'VIP Client Onboarding Vault',
    slug: 'vip-client-onboarding-vault',
    tagline: 'Anodized aluminum presentation chest with tactile collateral for seven-figure account welcomes.',
    description: 'Engineered specifically for agency client kickoffs and enterprise retention. Housed inside a precision-milled aerospace aluminum vault that glides open on pneumatic dampers. Contains a custom-bound full-grain Italian leather roadmap docket, encrypted biometric USB-C recovery key with agency brand assets, and two weighted crystal lowball glasses with frosted APEX geometric monogram.',
    price: 620,
    category: 'VIP Kits',
    images: [
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80'
    ],
    variants: [
      { id: 'vault_accent', name: 'Vault Accent', options: ['Cobalt Blue Laser Inlay', 'Pure Obsidian Ceramic'] },
      { id: 'leather', name: 'Docket Leather', options: ['Midnight Carbon', 'Espresso Nappa'] }
    ],
    features: [
      'Dual numeric roller lock with bespoke client combination preset',
      'Custom laser engraving of client CEO/CMO name and logo mark',
      'Precision waterjet-cut high-density EVA foam nest',
      'Includes hand-calligraphed welcome parchment on French cotton stock'
    ],
    stock: 28,
    rating: 4.92,
    reviewsCount: 51,
    featured: true,
    badge: 'Client Favorite',
    sku: 'APX-VIP-004',
    leadTime: '4-6 Business Days'
  },
  {
    id: 'prod_digital_brand_system',
    name: 'Brand Identity Guidelines & Presentation System',
    slug: 'brand-identity-guidelines-presentation-system',
    tagline: 'Master Figma component library, pitch deck frameworks, and physical linen-bound typography manual.',
    description: 'A comprehensive hybrid collateral suite designed for brands scaling across national media channels. Includes our agency-proven 120-component Figma Brand Architecture Library, 14 purpose-built Keynote and PowerPoint investor/campaign templates, and a 200-page Smyth-sewn linen hardcover brand guide printed on archival Mohawk Superfine 148GSM paper.',
    price: 490,
    category: 'Digital Systems',
    images: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?auto=format&fit=crop&w=1200&q=80'
    ],
    variants: [
      { id: 'edition', name: 'Delivery Format', options: ['Digital Master + Linen Book', 'Digital Master Only (-$150)'] },
      { id: 'license', name: 'Agency License', options: ['Single Enterprise Organization', 'Multi-Brand Holding Company'] }
    ],
    features: [
      'Instant cloud access to Figma component tokens and motion curves',
      '4K 60FPS motion graphic title card templates (After Effects & Premiere)',
      'Pre-formatted responsive layout grids for DOOH and digital billboards',
      'Physical hardcover book foil-stamped with genuine cobalt micro-leaf'
    ],
    stock: 99,
    rating: 4.89,
    reviewsCount: 64,
    featured: true,
    badge: 'Digital + Physical',
    sku: 'APX-DIG-002',
    leadTime: 'Instant Digital + 3 Days Print'
  },
  {
    id: 'prod_field_activation_pod',
    name: 'Field Marketing & Activation Pod',
    slug: 'field-marketing-activation-pod',
    tagline: 'Heavy-duty modular mobile pop-up kit for high-footfall street teams and sponsored festivals.',
    description: 'Built for experiential field marketing crews who require speed, weather durability, and uncompromising visual dominance. Contains an industrial 10x10ft hexagon-truss canopy with all-weather blockout sublimation skin, two rugged water-resistant high-output LED wash bars, branded audio kiosk pedestal with iPad lock mount, and 500 agency sample drop bags.',
    price: 1420,
    category: 'Event & Signage',
    images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'
    ],
    variants: [
      { id: 'size_format', name: 'Pod Footprint', options: ['Standard 10x10ft', 'Expanded 10x20ft Dual Bay'] },
      { id: 'tech_package', name: 'Tech Package', options: ['Tablet Lock Mounts Only', 'Full Audio/Lighting Integration'] }
    ],
    features: [
      'Wind-load certified to 35mph with included industrial anchoring kit',
      'Waterproof, flame-retardant UV-coated commercial 600D polyester canopy',
      'Compact packing into two wheeled impact-resistant Cordura transit trunks',
      'Custom Pantone matching for brand color fidelity'
    ],
    stock: 8,
    rating: 4.87,
    reviewsCount: 16,
    featured: false,
    badge: 'Experiential',
    sku: 'APX-EVT-015',
    leadTime: '7-12 Business Days'
  },
  {
    id: 'prod_hypergrowth_swag_capsule',
    name: 'Hyper-Growth Swag Capsule (50-Pack)',
    slug: 'hypergrowth-swag-capsule-50-pack',
    tagline: 'Curated 50-person agency collateral drops for Series B funding announcements and product launches.',
    description: 'Designed for fast-growing companies celebrating milestones. Includes 50 heavy French-terry 450GSM hoodies with custom silicone chest badges, 50 triple-insulated 750ml matte obsidian water bottles with laser-etched brand typography, 50 soft-touch vegan leather tech organizers, and 50 metallic presentation shipping cartons with tear-strip unboxing experience.',
    price: 2450,
    category: 'Apparel',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80'
    ],
    variants: [
      { id: 'size_distribution', name: 'Size Breakdown', options: ['Balanced Mix (10S, 15M, 15L, 10XL)', 'Custom Form Breakdown'] },
      { id: 'hoodie_color', name: 'Fabric Tone', options: ['Obsidian Core', 'Deep Space Cobalt'] }
    ],
    features: [
      '450GSM pre-shrunk combed organic cotton fleece',
      'Double-wall vacuum insulation keeps liquids cold 24h / hot 12h',
      'Individual unboxing experience for every team member',
      'Direct warehouse distribution to remote employees available'
    ],
    stock: 19,
    rating: 4.96,
    reviewsCount: 45,
    featured: true,
    badge: 'Popular for Teams',
    sku: 'APX-APP-030',
    leadTime: '5-7 Business Days'
  },
  {
    id: 'prod_pitch_deck_bundle',
    name: 'Creative Direction Pitch & Deck Bundle',
    slug: 'creative-direction-pitch-deck-bundle',
    tagline: 'Broadcast-grade cinematic deck systems and 3D device mockups for winning competitive agency RFPs.',
    description: 'The exact slide systems APEX MEDIA CO deployed to win over $40M in agency client accounts. Features 85 custom vector slide layouts, responsive aspect ratio setups (16:9 widescreen and 9:16 mobile pitch format), interactive data visualization charts, and 40 photorealistic 3D hardware clay and chrome mockups.',
    price: 290,
    category: 'Digital Systems',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80'
    ],
    variants: [
      { id: 'software', name: 'Software Suite', options: ['Keynote + Figma + PPT', 'Figma Native Only'] }
    ],
    features: [
      'Includes automated financial projection chart components',
      'Dark mode and ultra-contrast high-luminance light mode slides',
      'Typography hierarchy pre-mapped for Google Fonts & System Type',
      'Lifetime updates for future slide expansions'
    ],
    stock: 150,
    rating: 4.94,
    reviewsCount: 78,
    featured: false,
    badge: 'Instant Download',
    sku: 'APX-DIG-005',
    leadTime: 'Instant Download'
  },
  {
    id: 'prod_monolith_desk_kit',
    name: 'Monolith Executive Desk Collateral Set',
    slug: 'monolith-executive-desk-collateral-set',
    tagline: 'Solid aircraft aluminum desk pad, magnetic cable weight, and milled titanium rollerball instrument.',
    description: 'An understated statement for client partner desks. Crafted from a single plate of CNC-machined 6061-T6 aluminum with bead-blasted ceramic matte anodization. Features an integrated recessed pen well, magnetic cable anchor channel, and an Schmidt-cartridge titanium rollerball pen etched with APEX registration coordinates.',
    price: 380,
    category: 'VIP Kits',
    images: [
      'https://images.unsplash.com/photo-1585336261026-6a56e6d1dfc7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1200&q=80'
    ],
    variants: [
      { id: 'anodization', name: 'Finish', options: ['Matte Obsidian Grey', 'Electric Cobalt Accent Inlay'] }
    ],
    features: [
      'Non-slip micro-suction silicone backing protects fine wood desks',
      'Hand-assembled in low-volume production batches of 100',
      'Accompanied by serialized certificate of authenticity',
      'Waterjet-cut gift packaging with magnetic drop lid'
    ],
    stock: 0, // Intentionally 0 to demonstrate realistic out-of-stock edge case handling!
    rating: 4.91,
    reviewsCount: 19,
    featured: false,
    badge: 'Sold Out / Waitlist',
    sku: 'APX-VIP-009',
    leadTime: 'Backorder: 2 Weeks'
  }
];
