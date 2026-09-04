import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, PROMO_CODES } from './src/data/products';
import { CartItem, CartState, Order, Product } from './src/types';

const app = express();
const PORT = 3000;

app.use(express.json());

// Database storage setup
const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'store_db.json');

interface DatabaseSchema {
  products: Product[];
  cart: {
    items: CartItem[];
    promoCode?: string;
  };
  orders: Order[];
}

// Initialize database
function initDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }

  // Default seed database
  const initialDb: DatabaseSchema = {
    products: INITIAL_PRODUCTS,
    cart: {
      items: [
        {
          id: 'prod-1-Camel Tan-M',
          productId: 'prod-1',
          name: 'Minimalist Merino Wool Overcoat',
          price: 320,
          originalPrice: 380,
          image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=900',
          quantity: 1,
          selectedColor: 'Camel Tan',
          selectedSize: 'M',
          maxStock: 14
        },
        {
          id: 'prod-4-Olive Drab-42L Standard',
          productId: 'prod-4',
          name: 'Nomad Waxed Canvas Weekender',
          price: 195,
          originalPrice: 230,
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=900',
          quantity: 1,
          selectedColor: 'Olive Drab',
          selectedSize: '42L Standard',
          maxStock: 19
        }
      ],
      promoCode: 'WELCOME10'
    },
    orders: []
  };

  saveDatabase(initialDb);
  return initialDb;
}

let db = initDatabase();

function saveDatabase(dataToSave = db) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(dataToSave, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// Calculate cart totals
function calculateCartTotals(cartItems: CartItem[], promoCode?: string): CartState {
  const FREE_SHIPPING_THRESHOLD = 150;
  const STANDARD_SHIPPING = 15;
  const TAX_RATE = 0.08; // 8% sales tax

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let promoDiscountPercent = 0;
  let isFreeShippingPromo = false;

  if (promoCode && PROMO_CODES[promoCode.toUpperCase()]) {
    const promoVal = PROMO_CODES[promoCode.toUpperCase()];
    if (promoCode.toUpperCase() === 'FREESHIP') {
      isFreeShippingPromo = true;
    } else {
      promoDiscountPercent = promoVal;
    }
  }

  const discount = Math.round(subtotal * (promoDiscountPercent / 100));
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || isFreeShippingPromo;
  const shipping = cartItems.length === 0 ? 0 : (qualifiesForFreeShipping ? 0 : STANDARD_SHIPPING);
  const tax = Math.round((subtotal - discount) * TAX_RATE);
  const total = Math.max(0, subtotal - discount + shipping + tax);
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return {
    items: cartItems,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    promoCode: promoDiscountPercent > 0 || isFreeShippingPromo ? promoCode : undefined,
    promoDiscountPercent: promoDiscountPercent > 0 ? promoDiscountPercent : undefined,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    amountToFreeShipping
  };
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Products API
app.get('/api/products', (req, res) => {
  const { category, search, sort, inStock, maxPrice } = req.query;
  let results = [...db.products];

  if (category && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === (category as string).toLowerCase());
  }

  if (search) {
    const q = (search as string).toLowerCase().trim();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  if (inStock === 'true') {
    results = results.filter(p => p.inStock && p.stockCount > 0);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice as string);
    if (!isNaN(max)) {
      results = results.filter(p => p.price <= max);
    }
  }

  if (sort) {
    switch (sort) {
      case 'price-asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => (b.tag === 'New Arrival' ? 1 : 0) - (a.tag === 'New Arrival' ? 1 : 0));
        break;
      default:
        // Featured
        break;
    }
  }

  res.json({
    products: results,
    total: results.length
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Cart API
app.get('/api/cart', (req, res) => {
  const cartState = calculateCartTotals(db.cart.items, db.cart.promoCode);
  res.json(cartState);
});

app.post('/api/cart/add', (req, res) => {
  const { productId, quantity = 1, selectedColor, selectedSize } = req.body;
  const product = db.products.find(p => p.id === productId);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const color = selectedColor || product.colors[0]?.name || 'Default';
  const size = selectedSize || product.sizes[0] || 'Standard';
  const cartItemId = `${product.id}-${color}-${size}`;

  const existingItemIndex = db.cart.items.findIndex(item => item.id === cartItemId);

  if (existingItemIndex > -1) {
    const currentQty = db.cart.items[existingItemIndex].quantity;
    const newQty = Math.min(product.stockCount, currentQty + quantity);
    db.cart.items[existingItemIndex].quantity = newQty;
  } else {
    const newItem: CartItem = {
      id: cartItemId,
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      quantity: Math.min(product.stockCount, quantity),
      selectedColor: color,
      selectedSize: size,
      maxStock: product.stockCount
    };
    db.cart.items.push(newItem);
  }

  saveDatabase();
  const cartState = calculateCartTotals(db.cart.items, db.cart.promoCode);
  res.json(cartState);
});

app.post('/api/cart/update', (req, res) => {
  const { id, quantity } = req.body;
  const itemIndex = db.cart.items.findIndex(item => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    db.cart.items.splice(itemIndex, 1);
  } else {
    const item = db.cart.items[itemIndex];
    item.quantity = Math.min(item.maxStock, quantity);
  }

  saveDatabase();
  const cartState = calculateCartTotals(db.cart.items, db.cart.promoCode);
  res.json(cartState);
});

app.delete('/api/cart/item/:id', (req, res) => {
  const { id } = req.params;
  db.cart.items = db.cart.items.filter(item => item.id !== id);
  saveDatabase();
  const cartState = calculateCartTotals(db.cart.items, db.cart.promoCode);
  res.json(cartState);
});

app.post('/api/cart/clear', (req, res) => {
  db.cart.items = [];
  db.cart.promoCode = undefined;
  saveDatabase();
  const cartState = calculateCartTotals(db.cart.items);
  res.json(cartState);
});

app.post('/api/cart/promo', (req, res) => {
  const { promoCode } = req.body;
  const code = (promoCode || '').trim().toUpperCase();

  if (!code) {
    db.cart.promoCode = undefined;
    saveDatabase();
    return res.json(calculateCartTotals(db.cart.items));
  }

  if (PROMO_CODES[code]) {
    db.cart.promoCode = code;
    saveDatabase();
    const cartState = calculateCartTotals(db.cart.items, code);
    return res.json({ success: true, message: `Promo code "${code}" applied!`, ...cartState });
  } else {
    return res.status(400).json({ error: 'Invalid or expired promotional code. Try WELCOME10 or AURA15.' });
  }
});

// Orders & Checkout API
app.get('/api/orders', (req, res) => {
  res.json({ orders: db.orders });
});

app.post('/api/orders', (req, res) => {
  const { customer, paymentMethod = 'Credit Card' } = req.body;

  if (!customer || !customer.name || !customer.email || !customer.address) {
    return res.status(400).json({ error: 'Please provide full customer contact and shipping address details.' });
  }

  if (db.cart.items.length === 0) {
    return res.status(400).json({ error: 'Cannot checkout with an empty cart.' });
  }

  const cartCalculations = calculateCartTotals(db.cart.items, db.cart.promoCode);

  // Decrement product stock in database
  for (const item of db.cart.items) {
    const prod = db.products.find(p => p.id === item.productId);
    if (prod) {
      prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
      if (prod.stockCount === 0) {
        prod.inStock = false;
      }
    }
  }

  const newOrder: Order = {
    id: `ORD-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    items: [...db.cart.items],
    subtotal: cartCalculations.subtotal,
    discount: cartCalculations.discount,
    shipping: cartCalculations.shipping,
    tax: cartCalculations.tax,
    total: cartCalculations.total,
    promoCode: cartCalculations.promoCode,
    customer,
    paymentMethod,
    status: 'Confirmed'
  };

  db.orders.unshift(newOrder);
  db.cart.items = [];
  db.cart.promoCode = undefined;
  saveDatabase();

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    order: newOrder
  });
});

// Reset database demo endpoint
app.post('/api/reset-demo', (req, res) => {
  db = {
    products: INITIAL_PRODUCTS,
    cart: {
      items: [
        {
          id: 'prod-1-Camel Tan-M',
          productId: 'prod-1',
          name: 'Minimalist Merino Wool Overcoat',
          price: 320,
          originalPrice: 380,
          image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&q=80&w=900',
          quantity: 1,
          selectedColor: 'Camel Tan',
          selectedSize: 'M',
          maxStock: 14
        }
      ],
      promoCode: 'WELCOME10'
    },
    orders: []
  };
  saveDatabase();
  res.json({ success: true, message: 'Store database reset to fresh demo state.' });
});

// -------------------------------------------------------------
// SERVER SETUP & VITE MIDDLEWARE
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AURA eCommerce server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
