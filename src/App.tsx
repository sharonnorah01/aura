import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { WishlistModal } from './components/WishlistModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { api } from './services/api';
import { CartState, CustomerInfo, FilterState, Order, Product, ProductCategory } from './types';
import { ShieldCheck, Truck, RotateCcw, Heart, Sparkles, ArrowUp, RefreshCw, Mail, Database } from 'lucide-react';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Apparel',
  'Footwear',
  'Accessories',
  'Home & Living',
  'Lifestyle'
];

const INITIAL_CART: CartState = {
  items: [],
  subtotal: 0,
  discount: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  freeShippingThreshold: 150,
  amountToFreeShipping: 150
};

export default function App() {
  // Products & Loading
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    searchQuery: '',
    sortBy: 'featured',
    maxPrice: 500,
    inStockOnly: false
  });

  // Cart & Backend Sync
  const [cart, setCart] = useState<CartState>(INITIAL_CART);
  const [isCartSyncing, setIsCartSyncing] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('aura_wishlist');
      return saved ? new Set(JSON.parse(saved)) : new Set(['prod-2', 'prod-6']);
    } catch {
      return new Set(['prod-2']);
    }
  });

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', title: string, description?: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync cart from backend
  const refreshCart = useCallback(async () => {
    try {
      setIsCartSyncing(true);
      const cartData = await api.getCart();
      setCart(cartData);
    } catch (err) {
      console.error('Error fetching cart from backend:', err);
    } finally {
      setIsCartSyncing(false);
    }
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const data = await api.getProducts(filters);
      setProducts(data.products || []);
    } catch (err) {
      console.error('Error loading products:', err);
      addToast('error', 'Network Error', 'Failed to load store products from backend.');
    } finally {
      setIsLoadingProducts(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  // Save wishlist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('aura_wishlist', JSON.stringify(Array.from(wishlistIds)));
    } catch (e) {
      console.error('Failed to store wishlist:', e);
    }
  }, [wishlistIds]);

  // Handlers
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'All',
      searchQuery: '',
      sortBy: 'featured',
      maxPrice: 500,
      inStockOnly: false
    });
  };

  const handleQuickAdd = async (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setAddingProductId(product.id);
    try {
      setIsCartSyncing(true);
      const updatedCart = await api.addToCart(
        product.id,
        1,
        product.colors[0]?.name,
        product.sizes[0]
      );
      setCart(updatedCart);
      addToast('success', `Added to Bag`, `${product.name} (${product.colors[0]?.name || 'Standard'}) added.`);
    } catch (err: any) {
      addToast('error', 'Could not add to cart', err.message);
    } finally {
      setAddingProductId(null);
      setIsCartSyncing(false);
    }
  };

  const handleModalAddToCart = async (product: Product, quantity: number, color: string, size: string) => {
    try {
      setIsCartSyncing(true);
      const updatedCart = await api.addToCart(product.id, quantity, color, size);
      setCart(updatedCart);
      setSelectedProduct(null);
      addToast('success', `Added to Bag`, `${quantity}× ${product.name} (${color}, ${size}) added.`);
      setIsCartOpen(true);
    } catch (err: any) {
      addToast('error', 'Failed to add item', err.message);
    } finally {
      setIsCartSyncing(false);
    }
  };

  const handleUpdateQuantity = async (id: string, newQty: number) => {
    try {
      setIsCartSyncing(true);
      const updatedCart = await api.updateCartItemQuantity(id, newQty);
      setCart(updatedCart);
    } catch (err: any) {
      addToast('error', 'Update Failed', err.message);
    } finally {
      setIsCartSyncing(false);
    }
  };

  const handleRemoveCartItem = async (id: string) => {
    try {
      setIsCartSyncing(true);
      const updatedCart = await api.removeCartItem(id);
      setCart(updatedCart);
      addToast('info', 'Item Removed', 'Product was removed from your bag.');
    } catch (err: any) {
      addToast('error', 'Failed to remove', err.message);
    } finally {
      setIsCartSyncing(false);
    }
  };

  const handleClearCart = async () => {
    try {
      setIsCartSyncing(true);
      const updatedCart = await api.clearCart();
      setCart(updatedCart);
      addToast('info', 'Bag Cleared', 'All items have been removed.');
    } catch (err: any) {
      addToast('error', 'Clear failed', err.message);
    } finally {
      setIsCartSyncing(false);
    }
  };

  const handleApplyPromo = async (code: string) => {
    setIsCartSyncing(true);
    try {
      const res = await api.applyPromoCode(code);
      setCart(res);
      if (code) {
        addToast('success', 'Promo Code Applied!', res.message || `Code ${code} activated.`);
      } else {
        addToast('info', 'Promo Removed', 'Promotional discount removed.');
      }
    } catch (err: any) {
      throw err;
    } finally {
      setIsCartSyncing(false);
    }
  };

  const handleToggleWishlist = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) {
        next.delete(product.id);
        addToast('info', 'Wishlist Updated', `${product.name} removed from wishlist.`);
      } else {
        next.add(product.id);
        addToast('success', 'Saved to Wishlist', `${product.name} added to your favorites.`);
      }
      return next;
    });
  };

  const handlePlaceOrder = async (customer: CustomerInfo, paymentMethod: string): Promise<Order> => {
    const res = await api.createOrder(customer, paymentMethod);
    await refreshCart();
    await fetchProducts(); // Refresh stock counts in UI
    return res.order;
  };

  const handleResetDemoData = async () => {
    try {
      await api.resetDemo();
      await fetchProducts();
      await refreshCart();
      addToast('success', 'Store Reset', 'Database replenished to pristine demo state.');
    } catch (err) {
      console.error(err);
    }
  };

  const totalCartItemsCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistProducts = products.filter((p) => wishlistIds.has(p.id));

  return (
    <div className="min-h-screen bg-[#faf9f6] text-slate-800 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        categories={CATEGORIES}
        selectedCategory={filters.category}
        onSelectCategory={(cat) => handleFilterChange({ category: cat })}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => handleFilterChange({ searchQuery: q })}
        cartCount={totalCartItemsCount}
        wishlistCount={wishlistIds.size}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenOrders={() => setIsOrderHistoryOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        isCartSyncing={isCartSyncing}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Editorial Hero Banner */}
        {filters.category === 'All' && !filters.searchQuery && (
          <HeroBanner onExploreCategory={(cat) => handleFilterChange({ category: cat })} />
        )}

        {/* Product Grid Section */}
        <ProductGrid
          products={products}
          isLoading={isLoadingProducts}
          categories={CATEGORIES}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          onQuickAdd={handleQuickAdd}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
          addingProductId={addingProductId}
        />
      </main>

      {/* Product Details Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleModalAddToCart}
        isWishlisted={selectedProduct ? wishlistIds.has(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        isAddingToCart={selectedProduct ? addingProductId === selectedProduct.id : false}
      />

      {/* Shopping Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onApplyPromo={handleApplyPromo}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        isSyncing={isCartSyncing}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onPlaceOrder={handlePlaceOrder}
        onOrderSuccess={(order) => {
          addToast('success', 'Order Confirmed!', `Order ${order.id} placed and synced.`);
        }}
      />

      {/* Synced Order History Modal */}
      <OrderHistoryModal
        isOpen={isOrderHistoryOpen}
        onClose={() => setIsOrderHistoryOpen(false)}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onRemoveFromWishlist={(id) => {
          setWishlistIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
        }}
        onAddToCart={(prod) => {
          handleQuickAdd(prod, { stopPropagation: () => {} } as any);
        }}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={toasts}
        onDismiss={removeToast}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Colorful Store Footer */}
      <footer className="bg-gradient-to-b from-rose-50/60 via-amber-50/40 to-rose-100/50 text-slate-800 pt-16 pb-12 border-t border-rose-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-rose-200/80">
            
            {/* Brand column */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight uppercase bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 bg-clip-text text-transparent">
                  AURA.
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-200">
                  Store
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Vibrant contemporary apparel, expressive accessories, and colorful artisan lifestyle pieces crafted for modern living.
              </p>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-rose-200 text-[11px] text-slate-700 font-mono shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Database className="w-3.5 h-3.5 text-rose-500" />
                <span className="uppercase text-[10px] tracking-wider font-bold">Live DB Sync Active</span>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Collections
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                {CATEGORIES.slice(1).map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => {
                        handleFilterChange({ category: cat });
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="hover:text-rose-600 transition-colors cursor-pointer uppercase tracking-wider text-[11px] hover:translate-x-1 duration-150 inline-block"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-900 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Client Services
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                <li>
                  <button onClick={() => setIsOrderHistoryOpen(true)} className="hover:text-rose-600 transition-colors cursor-pointer uppercase tracking-wider text-[11px] hover:translate-x-1 duration-150 inline-block">
                    📦 Track Synced Orders
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsCartOpen(true)} className="hover:text-rose-600 transition-colors cursor-pointer uppercase tracking-wider text-[11px] hover:translate-x-1 duration-150 inline-block">
                    🛍️ Shopping Bag
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsWishlistOpen(true)} className="hover:text-rose-600 transition-colors cursor-pointer uppercase tracking-wider text-[11px] hover:translate-x-1 duration-150 inline-block">
                    💖 Saved Wishlist ({wishlistIds.size})
                  </button>
                </li>
                <li>
                  <button onClick={handleResetDemoData} className="hover:text-rose-600 transition-colors cursor-pointer text-slate-500 inline-flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                    <RotateCcw className="w-3 h-3 text-rose-500" />
                    <span>Reset Database</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Newsletter
              </h4>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                Join our colorful community for seasonal palettes, drop alerts, and <strong className="text-rose-600">10% off</strong>.
              </p>
              {newsletterSubscribed ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Subscribed! Use code AURA10 at checkout.</span>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newsletterEmail) {
                      setNewsletterSubscribed(true);
                      addToast('success', 'Newsletter Subscription', '10% discount code emailed to you.');
                    }
                  }}
                  className="space-y-2"
                >
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-rose-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      placeholder="ENTER EMAIL ADDRESS"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-white text-slate-900 text-xs pl-9 pr-3 py-2.5 rounded-xl border border-rose-200 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-300 placeholder:text-slate-400 placeholder:text-[10px] placeholder:tracking-widest uppercase shadow-2xs"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-[10px] uppercase tracking-[0.2em] py-3 rounded-xl transition-all shadow-md shadow-rose-500/20 cursor-pointer hover:scale-[1.01] active:scale-98"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Copyright and badges */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 uppercase tracking-widest gap-4">
            <div>
              © {new Date().getFullYear()} AURA Atelier Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-[10px] font-semibold">
              <span className="hover:text-rose-600 transition-colors cursor-pointer">Privacy</span>
              <span>•</span>
              <span className="hover:text-rose-600 transition-colors cursor-pointer">Terms</span>
              <span>•</span>
              <span className="hover:text-rose-600 transition-colors cursor-pointer">Ethics & Sourcing</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
