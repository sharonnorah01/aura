import React, { useState } from 'react';
import { SlidersHorizontal, ArrowUpDown, X, RotateCcw, PackageX } from 'lucide-react';
import { FilterState, Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  categories: ProductCategory[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  wishlistIds: Set<string>;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  addingProductId: string | null;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading,
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  onSelectProduct,
  onQuickAdd,
  wishlistIds,
  onToggleWishlist,
  addingProductId
}) => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const hasActiveFilters = 
    filters.category !== 'All' || 
    filters.searchQuery.trim() !== '' || 
    filters.sortBy !== 'featured' || 
    filters.maxPrice < 500 || 
    filters.inStockOnly;

  return (
    <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-10 sm:py-14">
      {/* Category Tabs & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-rose-100 mb-8 sm:mb-12">
        
        {/* Section Heading & Category Filter Tabs */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-rose-600">Seasonal Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-light text-slate-900 mb-1 tracking-tight">
            {filters.category === 'All' ? 'New Season Arrivals' : `${filters.category} Collection`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal tracking-wide mb-4">
            Curated essentials in joyful, expressive palettes for modern living.
          </p>

          {/* Colorful Category Filter Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => {
              const isSelected = filters.category === cat;
              return (
                <button
                  key={cat}
                  id={`grid-cat-pill-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => onFilterChange({ category: cat })}
                  className={`whitespace-nowrap px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white shadow-md shadow-rose-500/25 scale-105'
                      : 'bg-white hover:bg-rose-50/70 text-slate-600 hover:text-rose-600 border border-slate-200/80'
                  }`}
                >
                  {cat === 'All' ? '✨ View All' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Tools: Item count, Sort dropdown, and Filters toggle */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-mono">
            {products.length} {products.length === 1 ? 'Item' : 'Items'}
          </span>

          <div className="flex items-center gap-2.5">
            {/* Sort Selector */}
            <div className="relative inline-block">
              <select
                id="sort-select"
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ sortBy: e.target.value as FilterState['sortBy'] })}
                className="appearance-none bg-white hover:bg-rose-50/40 text-slate-800 text-[11px] font-bold uppercase tracking-wider py-2 pl-3.5 pr-8 border border-rose-200 rounded-full focus:outline-hidden focus:ring-2 focus:ring-rose-200 focus:border-rose-400 cursor-pointer shadow-xs"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low - High</option>
                <option value="price-desc">Price: High - Low</option>
                <option value="rating">Top Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
              <ArrowUpDown className="w-3 h-3 text-rose-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>

            {/* Filter Toggle Button */}
            <button
              id="toggle-filter-drawer-btn"
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider border rounded-full transition-all cursor-pointer shadow-xs ${
                filterDrawerOpen || filters.inStockOnly || filters.maxPrice < 500
                  ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-transparent shadow-rose-500/20'
                  : 'bg-white text-slate-700 hover:text-rose-600 hover:bg-rose-50/50 border-rose-200'
              }`}
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>Filters</span>
              {(filters.inStockOnly || filters.maxPrice < 500) && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Secondary Filter Panel */}
      {filterDrawerOpen && (
        <div className="mb-8 p-6 bg-gradient-to-br from-rose-50/50 via-amber-50/40 to-indigo-50/40 border border-rose-200/80 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-rose-200/60 mb-5">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-rose-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Filter Collection
            </h4>
            <button
              onClick={() => setFilterDrawerOpen(false)}
              className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {/* Price Filter Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                <span>Max Price</span>
                <span className="font-extrabold text-rose-600 font-mono">${filters.maxPrice}</span>
              </div>
              <input
                id="price-range-input"
                type="range"
                min="40"
                max="500"
                step="10"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
                className="w-full accent-rose-500 cursor-pointer h-1.5 bg-rose-200 rounded-full"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-widest">
                <span>$40</span>
                <span>$250</span>
                <span>$500</span>
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="flex items-center justify-between sm:justify-start sm:gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                In-Stock Only
              </span>
              <button
                id="in-stock-toggle-btn"
                type="button"
                role="switch"
                aria-checked={filters.inStockOnly}
                onClick={() => onFilterChange({ inStockOnly: !filters.inStockOnly })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  filters.inStockOnly ? 'bg-gradient-to-r from-rose-500 to-orange-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                    filters.inStockOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Reset Filters CTA */}
            <div className="flex items-center sm:justify-end">
              <button
                id="reset-filter-panel-btn"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold uppercase tracking-widest underline underline-offset-4 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Search & Filter Tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Active:
          </span>
          
          {filters.category !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold uppercase tracking-wider rounded-full">
              {filters.category}
              <button onClick={() => onFilterChange({ category: 'All' })} className="hover:text-rose-900 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[11px] font-bold uppercase tracking-wider rounded-full">
              "{filters.searchQuery}"
              <button onClick={() => onFilterChange({ searchQuery: '' })} className="hover:text-indigo-900 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold uppercase tracking-wider rounded-full">
              In Stock
              <button onClick={() => onFilterChange({ inStockOnly: false })} className="hover:text-emerald-900 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {filters.maxPrice < 500 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold uppercase tracking-wider rounded-full">
              Under ${filters.maxPrice}
              <button onClick={() => onFilterChange({ maxPrice: 500 })} className="hover:text-amber-950 cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            id="clear-all-filter-chips-btn"
            onClick={onResetFilters}
            className="text-[10px] font-bold uppercase tracking-widest text-rose-600 hover:text-rose-700 underline ml-2 cursor-pointer"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Main Responsive Colorful Product Grid */}
      <div>
        {isLoading ? (
          /* Skeletons */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="flex flex-col animate-pulse">
                <div className="aspect-[3/4] bg-rose-50/80 rounded-xl mb-4 border border-rose-100" />
                <div className="h-3.5 bg-rose-100/60 rounded-sm w-3/4 mb-2" />
                <div className="h-3 bg-amber-50/80 rounded-sm w-1/2 mb-3" />
                <div className="h-3.5 bg-rose-100/70 rounded-sm w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={onSelectProduct}
                onQuickAdd={onQuickAdd}
                isWishlisted={wishlistIds.has(product.id)}
                onToggleWishlist={onToggleWishlist}
                isAddingToCart={addingProductId === product.id}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 px-6 bg-gradient-to-br from-rose-50/50 via-amber-50/40 to-indigo-50/50 border border-rose-200/70 rounded-2xl max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <PackageX className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold uppercase tracking-[0.2em] text-slate-900 mb-2">
              No matching pieces
            </h3>
            <p className="text-slate-500 text-xs mb-6 max-w-xs mx-auto font-normal">
              We couldn't find items matching your search or filters. Try adjusting your selections.
            </p>
            <button
              id="empty-state-reset-btn"
              onClick={onResetFilters}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all shadow-md shadow-rose-500/25 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
