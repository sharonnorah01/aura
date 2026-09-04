import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { ProductCategory } from '../types';

interface HeroBannerProps {
  onExploreCategory: (category: ProductCategory) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreCategory }) => {
  return (
    <div className="relative bg-gradient-to-br from-amber-50/80 via-rose-50/60 to-indigo-50/80 text-slate-900 overflow-hidden border-b border-rose-100/80">
      {/* Subtle colorful decorative radial glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-300/25 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-12 sm:py-16 md:py-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          
          {/* Left: Colorful Hero Copy */}
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.25em] text-rose-700 bg-rose-100/90 border border-rose-200 px-3.5 py-1 rounded-full mb-4 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Edition 2026 • Curated Essentials
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-900 tracking-tight leading-tight sm:leading-tight mb-4">
              Curated essentials for the{' '}
              <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
                vibrant home.
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-normal tracking-wide leading-relaxed mb-8 max-w-lg">
              Refined apparel, expressive palettes, and timeless objects crafted with joyful energy, enduring materials, and pure form.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              <button
                id="hero-shop-all-btn"
                onClick={() => onExploreCategory('All')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-lg shadow-rose-500/25 rounded-full cursor-pointer hover:scale-[1.02] active:scale-98"
              >
                <span>Shop Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                id="hero-shop-apparel-btn"
                onClick={() => onExploreCategory('Apparel')}
                className="inline-flex items-center gap-2 bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-full cursor-pointer hover:border-amber-300"
              >
                <span>Apparel</span>
              </button>
              <button
                id="hero-shop-leather-btn"
                onClick={() => onExploreCategory('Home & Living')}
                className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200 px-5 py-3.5 text-xs font-bold uppercase tracking-[0.15em] transition-all rounded-full cursor-pointer hover:border-emerald-300"
              >
                <span>Living</span>
              </button>
            </div>
          </div>

          {/* Right: Full-Color Showcase Frame */}
          <div className="lg:w-1/2 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden shadow-xl shadow-rose-500/10 border-2 border-white/80 ring-1 ring-rose-200/60">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200"
                alt="Vibrant Interior & Apparel"
                className="w-full h-full object-cover saturate-110 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-rose-100 text-[10px] font-extrabold uppercase tracking-widest text-rose-700 shadow-md">
                ✨ Atelier Series 01
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Strip */}
      <div className="border-t border-rose-100/80 bg-white/60 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 text-[11px] text-slate-700 uppercase tracking-wider font-bold">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <span>Free Delivery Over $150</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Lifetime Material Warranty</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
              <span>30-Day Effortless Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
