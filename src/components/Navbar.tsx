import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Heart, Clock, ArrowRight } from 'lucide-react';
import { ProductCategory } from '../types';

interface NavbarProps {
  categories: ProductCategory[];
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenOrders: () => void;
  onOpenWishlist: () => void;
  isCartSyncing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenOrders,
  onOpenWishlist,
  isCartSyncing = false
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md text-slate-800 border-b border-rose-100/70 shadow-xs transition-all">
      {/* Top Colorful Announcement Bar */}
      <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 text-white text-[11px] font-medium tracking-wide py-2 px-4 sm:px-10 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-300 animate-pulse ring-2 ring-white/40" />
            <span className="hidden sm:inline text-white/95 uppercase tracking-widest text-[10px] font-bold">Complimentary Worldwide Delivery Over $150</span>
            <span className="sm:hidden text-white/95 uppercase tracking-widest text-[10px] font-bold">Free shipping over $150</span>
            <span className="text-white/40">•</span>
            <span className="text-white/90">Code <strong className="text-amber-200 font-extrabold uppercase tracking-wider bg-white/15 px-1.5 py-0.5 rounded-xs">WELCOME10</strong> for 10% off</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-white/90 text-[11px]">
            <button 
              id="nav-orders-link"
              onClick={onOpenOrders}
              className="hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer uppercase tracking-wider text-[10px] font-bold"
            >
              <Clock className="w-3.5 h-3.5 text-amber-200" />
              <span>Orders & Sync</span>
            </button>
            <span className="text-white/40">|</span>
            <span className="text-amber-100 font-mono text-[10px] bg-white/10 px-1.5 py-0.5 rounded-xs">USD ($)</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20 gap-6">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-4 lg:gap-10">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Brand Logo */}
            <a 
              href="#" 
              id="brand-logo"
              onClick={(e) => { e.preventDefault(); onSelectCategory('All'); }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <span className="text-2xl font-black tracking-tighter uppercase bg-gradient-to-r from-orange-500 via-rose-500 to-indigo-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
                AURA.
              </span>
              <span className="hidden sm:inline-block text-[9px] font-extrabold uppercase tracking-widest text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-full border border-rose-200">
                Studio
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-xs font-bold tracking-widest uppercase">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    id={`nav-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => onSelectCategory(cat)}
                    className={`transition-all cursor-pointer pb-1 relative ${
                      isActive
                        ? 'text-rose-600 font-extrabold'
                        : 'text-slate-600 hover:text-rose-500 font-semibold'
                    }`}
                  >
                    <span>{cat === 'All' ? 'Shop All' : cat}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 via-rose-500 to-purple-600 rounded-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Search & Actions */}
          <div className="flex items-center gap-3 sm:gap-6">
            {/* Desktop Search Input */}
            <div className="hidden md:flex items-center relative w-48 lg:w-72 bg-rose-50/40 border border-rose-100 rounded-full px-4 h-10 transition-all focus-within:border-rose-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-rose-100">
              <Search className="w-3.5 h-3.5 text-rose-400 mr-2 shrink-0 pointer-events-none" />
              <input
                id="desktop-search-input"
                type="text"
                placeholder="Search essentials..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-transparent text-slate-800 text-xs focus:outline-hidden placeholder:text-rose-300 placeholder:text-[11px] placeholder:uppercase placeholder:tracking-widest"
              />
              {searchQuery && (
                <button
                  id="desktop-clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="text-rose-400 hover:text-rose-700 ml-1 text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-slate-700 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors"
              aria-label="Toggle search bar"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Button */}
            <button
              id="nav-wishlist-btn"
              onClick={onOpenWishlist}
              className="w-10 h-10 flex items-center justify-center text-rose-600 hover:text-rose-700 rounded-full hover:bg-rose-50 transition-colors relative cursor-pointer"
              aria-label="View wishlist"
            >
              <Heart className="w-4 h-4 fill-rose-50 stroke-rose-600 hover:fill-rose-100" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              id="nav-cart-btn"
              onClick={onOpenCart}
              className="flex items-center gap-2 group cursor-pointer transition-transform active:scale-95"
              aria-label="Open shopping bag"
            >
              <div className="h-10 w-10 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md shadow-rose-500/25 group-hover:from-rose-600 group-hover:to-orange-600 transition-all relative">
                {cartCount}
                {isCartSyncing && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-300 border-2 border-white rounded-full animate-ping" />
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-slate-800 group-hover:text-rose-600 transition-colors">
                Bag
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-4 pt-1 border-t border-rose-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="relative bg-rose-50/50 border border-rose-200 rounded-full flex items-center px-4 h-10">
              <Search className="w-3.5 h-3.5 text-rose-400 mr-2" />
              <input
                id="mobile-search-input"
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-slate-800 text-xs focus:outline-hidden placeholder:text-rose-400 uppercase tracking-wider text-[11px]"
              />
              {searchQuery && (
                <button
                  id="mobile-clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="text-rose-400 hover:text-rose-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[115px] bg-white/98 backdrop-blur-md border-b border-rose-100 shadow-xl p-6 transition-all animate-in fade-in slide-in-from-top-4 duration-200 z-30">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-400 mb-3">
            Collections
          </div>
          <div className="flex flex-col gap-2 mb-6">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`mobile-nav-cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer rounded-lg ${
                    isActive
                      ? 'text-rose-600 bg-rose-50/80 border-l-4 border-rose-500 font-extrabold'
                      : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/40'
                  }`}
                >
                  <span>{cat === 'All' ? 'Shop All' : cat}</span>
                  {isActive && <ArrowRight className="w-3.5 h-3.5 text-rose-600" />}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-rose-100 flex flex-col gap-2">
            <button
              id="mobile-orders-btn"
              onClick={() => {
                onOpenOrders();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-xs font-bold tracking-widest uppercase text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 rounded-md"
            >
              <Clock className="w-4 h-4 text-rose-400" />
              <span>Past Orders & Sync Status</span>
            </button>
            <button
              id="mobile-wishlist-menu-btn"
              onClick={() => {
                onOpenWishlist();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-bold tracking-widest uppercase text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 rounded-md"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-100" />
                <span>Saved Wishlist</span>
              </div>
              {wishlistCount > 0 && (
                <span className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
