import React, { useState, useEffect } from 'react';
import { X, Star, Check, ShoppingBag, Shield, Truck, RefreshCw, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, color: string, size: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  isAddingToCart?: boolean;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
  isAddingToCart = false
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedColor(product.colors[0]?.name || 'Default');
      setSelectedSize(product.sizes[0] || 'Standard');
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedColor, selectedSize);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-sm max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-100 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-product-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-900 bg-white/80 rounded-full transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery Section */}
        <div className="md:w-1/2 p-6 sm:p-8 bg-gradient-to-br from-rose-50/50 via-amber-50/40 to-indigo-50/40 flex flex-col justify-between border-b md:border-b-0 md:border-r border-rose-100">
          <div className="space-y-4">
            {/* Main Featured Photo */}
            <div className="aspect-[3/4] w-full rounded-2xl overflow-hidden bg-white border border-rose-100 shadow-sm relative">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
              {product.tag && (
                <span className="absolute top-3 left-3 px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider bg-gradient-to-r from-rose-500 to-orange-500 text-white rounded-full shadow-xs">
                  {product.tag}
                </span>
              )}
            </div>

            {/* Thumbnail Selectors */}
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {product.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-14 h-18 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer shadow-xs ${
                      selectedImage === imgUrl ? 'border-rose-500 ring-2 ring-rose-300 scale-105' : 'border-rose-100 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Guarantees */}
          <div className="mt-6 pt-4 border-t border-rose-200/80 grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wider text-slate-600 font-bold">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-1">
                <Truck className="w-3.5 h-3.5" />
              </div>
              <span>Complimentary</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                <RefreshCw className="w-3.5 h-3.5" />
              </div>
              <span>30-Day Return</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <span>Artisan Built</span>
            </div>
          </div>
        </div>

        {/* Right: Details & Purchase Options */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div>
            {/* Category & Ratings */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-extrabold tracking-[0.2em] text-rose-600 uppercase bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                {product.category}
              </span>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-extrabold text-slate-900">{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 text-[11px]">({product.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-2xl font-semibold text-slate-900 mb-1 tracking-tight">
              {product.name}
            </h2>

            {/* Subtitle */}
            <p className="text-xs text-slate-500 italic mb-4">
              {product.subtitle}
            </p>

            {/* Price section */}
            <div className="flex items-baseline gap-3 pb-4 border-b border-rose-100 mb-5">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">
                ${product.price}.00
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xs text-rose-400 line-through font-mono">
                    ${product.originalPrice}.00
                  </span>
                  <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 uppercase tracking-wider">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed mb-6 font-normal">
              {product.description}
            </p>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    Color: <span className="font-semibold text-rose-600">{selectedColor}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((color) => {
                    const isSelected = selectedColor === color.name;
                    return (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`group relative flex items-center justify-center w-7 h-7 rounded-full border transition-all cursor-pointer ${
                          isSelected ? 'border-rose-500 ring-2 ring-rose-300 scale-110' : 'border-slate-200 hover:scale-105'
                        }`}
                        title={color.name}
                      >
                        <span
                          className="w-5 h-5 rounded-full shadow-xs"
                          style={{ backgroundColor: color.hex }}
                        />
                        {isSelected && (
                          <Check className={`w-3 h-3 absolute ${['#FFFFFF', '#ECE7DE', '#EFEAE1', '#D6C7B2'].includes(color.hex) ? 'text-slate-900' : 'text-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size / Variant Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
                    Specification: <span className="font-semibold text-rose-600">{selectedSize}</span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white border-transparent shadow-xs'
                            : 'bg-white text-slate-700 border-rose-200 hover:bg-rose-50'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Features Bullet List */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6 bg-rose-50/50 p-4 border border-rose-100 rounded-xl">
                <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-[0.2em] block mb-2">
                  ✨ Specifications & Craft
                </span>
                <ul className="space-y-1">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Action Row: Quantity + Add to Cart + Wishlist */}
          <div className="pt-4 border-t border-rose-100">
            {/* Stock status indicator */}
            <div className="flex items-center justify-between mb-3 text-[10px] uppercase tracking-widest font-bold">
              <span className={product.stockCount > 5 ? 'text-emerald-700' : 'text-amber-700'}>
                {product.stockCount > 5 ? '● In Stock & Ready to Ship' : `🔥 Limited: Only ${product.stockCount} Left`}
              </span>
              <span className="text-slate-400 font-mono">REF: {product.id.toUpperCase()}</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Stepper */}
              <div className="flex border border-rose-200 rounded-xl overflow-hidden items-center bg-white shadow-xs">
                <button
                  id="modal-qty-minus-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-xs text-slate-700 hover:bg-rose-50 font-bold cursor-pointer"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-2 font-extrabold text-xs text-slate-900 font-mono">
                  {quantity}
                </span>
                <button
                  id="modal-qty-plus-btn"
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="px-3 py-2 text-xs text-slate-700 hover:bg-rose-50 font-bold cursor-pointer"
                  disabled={quantity >= product.stockCount}
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                id="modal-add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart}
                className={`flex-1 py-3.5 px-6 font-bold text-xs tracking-[0.2em] uppercase rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-rose-500/25 ${
                  isAddingToCart
                    ? 'bg-emerald-600 text-white'
                    : product.inStock
                    ? 'bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white hover:scale-[1.01] active:scale-98'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {isAddingToCart ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag • ${(product.price * quantity).toFixed(0)}.00</span>
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                id="modal-wishlist-toggle-btn"
                onClick={() => onToggleWishlist(product)}
                className={`p-3.5 border rounded-xl transition-all cursor-pointer shadow-xs ${
                  isWishlisted
                    ? 'border-rose-200 bg-rose-50 text-rose-600 scale-105'
                    : 'border-rose-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                }`}
                aria-label="Wishlist toggle"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
