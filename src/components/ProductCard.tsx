import React from 'react';
import { Star, ShoppingBag, Eye, Heart, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  onQuickAdd: (product: Product, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product, e: React.MouseEvent) => void;
  isAddingToCart?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onQuickAdd,
  isWishlisted,
  onToggleWishlist,
  isAddingToCart = false
}) => {
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  // Category tint for soft playful photo frames
  const getCategoryCardBg = (cat: string) => {
    switch (cat) {
      case 'Apparel': return 'bg-amber-50/60 border-amber-100/80';
      case 'Footwear': return 'bg-indigo-50/60 border-indigo-100/80';
      case 'Accessories': return 'bg-emerald-50/60 border-emerald-100/80';
      case 'Home & Living': return 'bg-orange-50/60 border-orange-100/80';
      case 'Lifestyle': return 'bg-purple-50/60 border-purple-100/80';
      default: return 'bg-rose-50/50 border-rose-100/80';
    }
  };

  const getTagBadgeStyle = (tag?: string) => {
    if (!tag) return 'bg-slate-900 text-white';
    if (tag.includes('Best')) return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs';
    if (tag.includes('New')) return 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs';
    if (tag.includes('Limited')) return 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-xs';
    if (tag.includes('Artisan')) return 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs';
    if (tag.includes('Trending')) return 'bg-gradient-to-r from-fuchsia-600 to-rose-500 text-white shadow-xs';
    if (tag.includes('Sale')) return 'bg-gradient-to-r from-rose-600 to-red-500 text-white shadow-xs';
    return 'bg-gradient-to-r from-slate-900 to-slate-800 text-white';
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Image Container with Badges */}
      <div className={`aspect-[3/4] w-full ${getCategoryCardBg(product.category)} rounded-xl mb-3.5 relative overflow-hidden flex items-center justify-center border shadow-xs group-hover:shadow-lg group-hover:shadow-rose-500/10 transition-all duration-300`}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.tag && (
            <span
              id={`tag-${product.id}`}
              className={`px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase rounded-full ${getTagBadgeStyle(product.tag)}`}
            >
              {product.tag}
            </span>
          )}

          {discountPercent && !product.tag?.includes('Sale') && (
            <span className="px-2.5 py-0.5 text-[9px] font-extrabold tracking-wider uppercase bg-gradient-to-r from-rose-600 to-red-500 text-white rounded-full shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={(e) => onToggleWishlist(product, e)}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 cursor-pointer shadow-xs ${
            isWishlisted
              ? 'bg-white text-rose-600 scale-110'
              : 'bg-white/85 text-slate-400 hover:text-rose-600 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Stock Badge if low */}
        {product.stockCount <= 8 && product.inStock && (
          <div className="absolute bottom-3 left-3 bg-white/95 text-amber-800 text-[9px] font-extrabold px-2.5 py-0.5 tracking-wider uppercase rounded-full border border-amber-200 shadow-xs">
            🔥 {product.stockCount} Left
          </div>
        )}

        {/* Inset Hover Quick Add Button (Desktop) */}
        <div className="hidden sm:flex absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 gap-1.5">
          <button
            id={`quick-add-btn-${product.id}`}
            onClick={(e) => onQuickAdd(product, e)}
            disabled={!product.inStock || isAddingToCart}
            className={`flex-1 py-2.5 px-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white text-[10px] font-bold uppercase tracking-widest transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-rose-500/25 ${
              !product.inStock ? 'opacity-60 cursor-not-allowed bg-slate-200 text-slate-400 from-transparent to-transparent' : ''
            }`}
          >
            {isAddingToCart ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>Added!</span>
              </>
            ) : product.inStock ? (
              <>
                <ShoppingBag className="w-3 h-3" />
                <span>Quick Add</span>
              </>
            ) : (
              <span>Sold Out</span>
            )}
          </button>

          <button
            id={`quick-view-btn-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectProduct(product);
            }}
            className="p-2.5 bg-white/95 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-rose-200 rounded-lg transition-colors shadow-xs"
            title="Quick View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div>
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 pr-2">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="text-xs font-extrabold text-slate-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-rose-500 font-semibold line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        {/* Subtitle / Material */}
        <p className="text-xs text-slate-500 italic mb-2 line-clamp-1">
          {product.subtitle}
        </p>

        {/* Secondary Info: Swatches, Rating, Mobile Quick Add */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            {/* Color preview dots */}
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 3).map((col) => (
                <span
                  key={col.name}
                  className="w-2.5 h-2.5 rounded-full border border-white shadow-xs ring-1 ring-slate-200"
                  style={{ backgroundColor: col.hex }}
                  title={col.name}
                />
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-slate-600">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-700">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Mobile-only Quick Add Button */}
          <button
            id={`mobile-quick-add-${product.id}`}
            onClick={(e) => onQuickAdd(product, e)}
            disabled={!product.inStock || isAddingToCart}
            className={`sm:hidden p-2 rounded-lg border transition-all cursor-pointer shadow-xs ${
              isAddingToCart
                ? 'bg-emerald-500 text-white border-emerald-600'
                : product.inStock
                ? 'bg-rose-50 text-rose-600 border-rose-200 active:bg-rose-500 active:text-white'
                : 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
            }`}
            aria-label="Add to shopping bag"
          >
            {isAddingToCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
