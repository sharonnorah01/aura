import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Minimalist Merino Wool Overcoat',
    subtitle: 'Tailored fit in premium Australian merino wool',
    tag: 'Bestseller',
    price: 320,
    originalPrice: 380,
    rating: 4.9,
    reviewsCount: 142,
    category: 'Apparel',
    description: 'Crafted from 100% fine Australian Merino wool with a water-resistant finish. Features structured shoulders, notched lapels, horn buttons, and deep welt pockets. Designed for effortless transitional layering.',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Camel Tan', hex: '#C19A6B' },
      { name: 'Charcoal Slate', hex: '#374151' },
      { name: 'Midnight Navy', hex: '#1E293B' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 14,
    features: [
      '100% Virgin Merino Wool',
      'Recycled cupro lining for smooth glide',
      'Interior passport & phone pocket',
      'Dry clean only'
    ]
  },
  {
    id: 'prod-2',
    name: 'Vanguard Leather Chelsea Boots',
    subtitle: 'Handcrafted full-grain Italian leather with storm welt',
    tag: 'Staff Pick',
    price: 245,
    originalPrice: 290,
    rating: 4.8,
    reviewsCount: 98,
    category: 'Footwear',
    description: 'An iconic silhouette reconstructed with full-grain vegetable-tanned leather and custom Goodyear welted soles. Elasticated side gussets and dual nylon pull tabs ensure seamless slip-on comfort.',
    image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Cognac Brown', hex: '#8B4513' },
      { name: 'Onyx Black', hex: '#171717' },
      { name: 'Weathered Suede', hex: '#9E886D' }
    ],
    sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
    inStock: true,
    stockCount: 8,
    features: [
      'Vegetable-tanned Italian calfskin',
      'Vibram anti-slip rubber lug outsole',
      'Memory foam cushioned insole',
      'Reinforced storm welt'
    ]
  },
  {
    id: 'prod-3',
    name: 'Atelier Ceramic Pour-Over & Carafe',
    subtitle: 'Hand-thrown stoneware with precision heat retention',
    tag: 'New Arrival',
    price: 78,
    rating: 4.9,
    reviewsCount: 53,
    category: 'Home & Living',
    description: 'Designed in collaboration with Kyoto ceramic artisans. Features internal spiral ridges for optimum water dispersion and extraction rate. Accompanied by a heat-resistant borosilicate carafe.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Sand Matte', hex: '#D6C7B2' },
      { name: 'Basalt Black', hex: '#262626' },
      { name: 'Terracotta', hex: '#C86A4B' }
    ],
    sizes: ['500ml', '800ml'],
    inStock: true,
    stockCount: 22,
    features: [
      'High-fire durable stoneware ceramic',
      'Compatible with standard V02 cone filters',
      'Dishwasher and microwave safe',
      'Includes bamboo resting lid'
    ]
  },
  {
    id: 'prod-4',
    name: 'Nomad Waxed Canvas Weekender',
    subtitle: 'Weatherproof 18oz Scottish canvas with bridle leather trim',
    tag: 'Bestseller',
    price: 195,
    originalPrice: 230,
    rating: 4.9,
    reviewsCount: 167,
    category: 'Accessories',
    description: 'The definitive short-stay travel companion. Engineered from heavy-duty paraffin-waxed canvas that develops a unique vintage patina over time. Includes an expandable separate shoe compartment.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Olive Drab', hex: '#4B5320' },
      { name: 'Heritage Khaki', hex: '#C3B091' },
      { name: 'Deep Indigo', hex: '#1A2A3A' }
    ],
    sizes: ['42L Standard', '55L Extended'],
    inStock: true,
    stockCount: 19,
    features: [
      '18oz water-repellent waxed duck canvas',
      'Solid brass YKK zippers and rivets',
      'Padded 16" laptop protective sleeve',
      'TSA carry-on approved dimensions'
    ]
  },
  {
    id: 'prod-5',
    name: 'Architect Heavyweight Boxy Tee',
    subtitle: '280 GSM combed organic cotton with relaxed drape',
    price: 55,
    rating: 4.7,
    reviewsCount: 89,
    category: 'Apparel',
    description: 'The essential heavyweight tee engineered for structural silhouette and daily wear. Pre-shrunk organic ring-spun cotton that gets softer with every wash without losing its crisp neckline.',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Raw Natural', hex: '#ECE7DE' },
      { name: 'Washed Black', hex: '#2B2B2B' },
      { name: 'Sage Green', hex: '#8F9E8B' },
      { name: 'Crisp White', hex: '#FFFFFF' }
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    stockCount: 45,
    features: [
      '100% GOTS Certified Organic Cotton',
      '280 GSM ultra-heavyweight knit',
      'Reinforced double-stitched ribbed collar',
      'Ethically milled in Portugal'
    ]
  },
  {
    id: 'prod-6',
    name: 'Apex Mechanical Chronograph Watch',
    subtitle: 'Sapphire crystal glass with Japanese automatic movement',
    tag: 'Limited Edition',
    price: 390,
    originalPrice: 450,
    rating: 5.0,
    reviewsCount: 31,
    category: 'Accessories',
    description: 'Sleek architectural lines meet horological precision. Housed in 316L surgical stainless steel with a domed anti-reflective sapphire crystal. 50-meter water resistance and 42-hour power reserve.',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Silver & Silver Mesh', hex: '#D1D5DB' },
      { name: 'PVD Matte Black', hex: '#1F2937' },
      { name: 'Rose Gold & Saddle', hex: '#B76E79' }
    ],
    sizes: ['38mm', '41mm'],
    inStock: true,
    stockCount: 5,
    features: [
      '316L Surgical grade stainless steel casing',
      'Scratchproof double-domed sapphire crystal',
      'Automatic 24-jewel Japanese caliber',
      'Interchangeable quick-release strap system'
    ]
  },
  {
    id: 'prod-7',
    name: 'Nordic Cast Iron Dutch Oven',
    subtitle: '4.5 Qt enameled cast iron for precision braising & baking',
    tag: 'Bestseller',
    price: 135,
    originalPrice: 160,
    rating: 4.8,
    reviewsCount: 112,
    category: 'Home & Living',
    description: 'The centerpiece of rustic culinary craft. Heavy cast iron delivers even heat distribution and exceptional moisture retention with self-basting spikes on the inner lid.',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1588854337236-6889d631faa8?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Forest Moss', hex: '#3E4D3E' },
      { name: 'Nordic Cream', hex: '#EFEAE1' },
      { name: 'Midnight Matte', hex: '#18181B' }
    ],
    sizes: ['4.5 Quart', '6.5 Quart'],
    inStock: true,
    stockCount: 15,
    features: [
      'Triple-enameled scratch-resistant coating',
      'Oven safe up to 500°F (260°C)',
      'Stainless steel heat-proof knob',
      'Induction, gas, and ceramic cooktop ready'
    ]
  },
  {
    id: 'prod-8',
    name: 'Structured Linen Resort Shirt',
    subtitle: '100% French flax linen with camp collar and mother-of-pearl buttons',
    tag: 'Sale',
    price: 85,
    originalPrice: 110,
    rating: 4.6,
    reviewsCount: 74,
    category: 'Apparel',
    description: 'Breezy and effortlessly refined. Woven from medium-weight Normandy flax linen that breathes effortlessly in warm climes and drapes naturally without cling.',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Oatmeal Heather', hex: '#D7CEC7' },
      { name: 'Aegean Blue', hex: '#4A7C9B' },
      { name: 'Olive Green', hex: '#5A6351' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
    stockCount: 28,
    features: [
      '100% Normandy Flax Linen',
      'Garment-washed for instant softness',
      'Relaxed retro camp collar',
      'Natural Australian mother-of-pearl buttons'
    ]
  },
  {
    id: 'prod-9',
    name: 'Acoustic Solid Walnut Headphone Stand',
    subtitle: 'Solid American black walnut and sandblasted matte aluminum',
    price: 68,
    rating: 4.9,
    reviewsCount: 62,
    category: 'Lifestyle',
    description: 'Elevate your workspace desk aesthetic. Crafted from a single piece of kiln-dried American walnut with curved headrest to protect delicate leather and foam headphone bands.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Natural Walnut', hex: '#5C4033' },
      { name: 'Smoked Oak', hex: '#3B312B' },
      { name: 'Blonde Ash', hex: '#C2B280' }
    ],
    sizes: ['Standard'],
    inStock: true,
    stockCount: 16,
    features: [
      'FSC-Certified Solid American Walnut',
      'Weighted anti-slip silicone base pad',
      'Ergonomic band relief contouring',
      'Integrated rear cable management channel'
    ]
  },
  {
    id: 'prod-10',
    name: 'Studio Raw Selvedge Denim',
    subtitle: '14.5oz Japanese Kurabo Mills shuttle loom denim',
    tag: 'Staff Pick',
    price: 180,
    originalPrice: 215,
    rating: 4.8,
    reviewsCount: 104,
    category: 'Apparel',
    description: 'Woven slowly on vintage shuttle looms in Kojima, Japan. Features red selvedge ID line, copper chain-stitching, and unwashed raw denim ready to fade to your unique lifestyle.',
    image: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Deep Indigo Raw', hex: '#16233B' },
      { name: 'Overdyed Black', hex: '#111111' }
    ],
    sizes: ['30x32', '31x32', '32x32', '33x32', '34x32', '36x32'],
    inStock: true,
    stockCount: 12,
    features: [
      '14.5oz Kurabo Mills Raw Selvedge Denim',
      'Custom embossed copper rivets & donut buttons',
      'Full grain cowhide back patch',
      'Tailored slim straight cut'
    ]
  },
  {
    id: 'prod-11',
    name: 'Serenade Hand-Blown Borosilicate Tumbler Set',
    subtitle: 'Set of 4 stackable fluted amber glassware',
    price: 48,
    rating: 4.7,
    reviewsCount: 45,
    category: 'Home & Living',
    description: 'Add tactility and amber warm tones to your table setting. Ribbed vertical fluting offers tactile grip while thermal shock-resistant borosilicate holds both iced cold brew and hot tea.',
    image: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Warm Amber', hex: '#D97706' },
      { name: 'Smoky Grey', hex: '#64748B' },
      { name: 'Forest Green', hex: '#166534' }
    ],
    sizes: ['350ml (Set of 4)'],
    inStock: true,
    stockCount: 30,
    features: [
      'Hand-blown lightweight borosilicate glass',
      'Thermal shock resistant (-20°C to 150°C)',
      'Space-saving nesting stackable design',
      'Dishwasher safe'
    ]
  },
  {
    id: 'prod-12',
    name: 'Latitude Minimalist Travel Sling',
    subtitle: 'Cordura® ballistic nylon with magnetic Fidlock® clasp',
    tag: 'New Arrival',
    price: 92,
    rating: 4.9,
    reviewsCount: 88,
    category: 'Accessories',
    description: 'Keep your everyday essentials secure and accessible on the move. Features self-healing YKK Aquaguard zippers, a concealed passport pouch, and rapid one-hand Fidlock magnetic adjustment.',
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=900',
    gallery: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=1200'
    ],
    colors: [
      { name: 'Matte Stealth Black', hex: '#1C1917' },
      { name: 'Coyote Tan', hex: '#A88B67' },
      { name: 'Storm Grey', hex: '#4B5563' }
    ],
    sizes: ['3.5L Everyday', '5L Pro'],
    inStock: true,
    stockCount: 25,
    features: [
      '1000D Cordura® Water-Repellent Ballistic Nylon',
      'Fidlock® German Magnetic V-Buckle',
      'Microfiber lined scratchless sunglasses pocket',
      'Detachable key tether'
    ]
  }
];

export const PROMO_CODES: Record<string, number> = {
  'WELCOME10': 10,
  'AURA15': 15,
  'SUMMER20': 20,
  'FREESHIP': 100 // 100% off shipping
};
