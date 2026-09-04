import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, AlertCircle, Database } from 'lucide-react';
import { CartState } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartState;
  onUpdateQuantity: (id: string, newQty: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onApplyPromo: (code: string) => Promise<void>;
  onProceedToCheckout: () => void;
  isSyncing?: boolean;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onApplyPromo,
  onProceedToCheckout,
  isSyncing = false
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  if (!isOpen) return null;

  const totalItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const freeShippingProgress = Math.min(100, Math.round((cart.subtotal / cart.freeShippingThreshold) * 100));

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    setPromoError('');
    setPromoLoading(true);
    try {
      await onApplyPromo(promoInput.trim());
      setPromoInput('');
    } catch (err: any) {
      setPromoError(err.message || 'Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = async () => {
    try {
      await onApplyPromo('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Slide-out Drawer from Right */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <aside className="w-screen max-w-md bg-white border-l border-rose-100 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-6 sm:p-7 border-b border-rose-100 flex items-center justify-between bg-gradient-to-r from-rose-50/70 via-amber-50/50 to-indigo-50/60">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-rose-600 via-orange-600 to-indigo-600 bg-clip-text text-transparent">
                Shopping Bag
              </h2>
              <span className="text-[10px] text-rose-700 font-extrabold bg-rose-100/90 px-2.5 py-0.5 rounded-full border border-rose-200">
                {totalItemCount}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Database Sync Status Indicator */}
              <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Database className="w-3 h-3 text-emerald-600" />
                <span>{isSyncing ? 'Syncing...' : 'Synced'}</span>
              </div>

              {/* Close button */}
              <button
                id="close-cart-drawer-btn"
                onClick={onClose}
                className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-1 rounded-full hover:bg-rose-50"
                aria-label="Close bag"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Complimentary Shipping Progress */}
          <div className="bg-gradient-to-r from-amber-50/80 via-rose-50/80 to-purple-50/80 px-6 sm:px-7 py-3.5 border-b border-rose-100">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-700 mb-1.5">
              {cart.amountToFreeShipping > 0 ? (
                <span className="text-rose-700 font-extrabold flex items-center gap-1">
                  <span>✨</span> Add ${cart.amountToFreeShipping} for Free Express Delivery
                </span>
              ) : (
                <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                  <span>🎉</span> Complimentary Delivery Unlocked!
                </span>
              )}
              <span className="font-mono text-rose-600 font-bold">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-rose-100/70 h-2 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-rose-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-7 space-y-5">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mb-4 shadow-inner">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-800 mb-1">
                  Your bag is empty
                </h4>
                <p className="text-slate-500 text-xs max-w-xs mb-6 font-normal">
                  Discover curated objects and pieces crafted in joyful color for modern living.
                </p>
                <button
                  id="empty-cart-shop-cta"
                  onClick={onClose}
                  className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] hover:from-rose-600 hover:to-orange-600 transition-all rounded-full shadow-md shadow-rose-500/25 cursor-pointer"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="flex gap-4 pb-5 border-b border-rose-100/70 last:border-b-0"
                >
                  {/* Thumbnail */}
                  <div className="h-24 w-20 bg-rose-50/50 rounded-xl flex-shrink-0 overflow-hidden border border-rose-100 shadow-xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <p className="text-[10px] text-rose-600/80 font-medium uppercase tracking-wider mt-0.5">
                            {item.selectedColor} • {item.selectedSize}
                          </p>
                        </div>
                        <span className="text-xs font-extrabold text-slate-900 font-mono">
                          ${item.price * item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Stepper and Remove */}
                    <div className="flex items-center justify-between pt-2">
                      {/* Stepper */}
                      <div className="flex border border-rose-200 rounded-lg overflow-hidden items-center bg-white shadow-xs">
                        <button
                          id={`qty-minus-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2.5 py-1 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors font-bold cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 text-[11px] font-bold text-slate-900 font-mono">
                          {item.quantity}
                        </span>
                        <button
                          id={`qty-plus-${item.id}`}
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxStock}
                          className="px-2.5 py-1 text-xs text-slate-700 hover:bg-rose-50 hover:text-rose-600 transition-colors font-bold disabled:opacity-30 cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        id={`remove-cart-item-${item.id}`}
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-rose-600 underline underline-offset-4 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {cart.items.length > 0 && (
            <div className="p-6 sm:p-7 bg-gradient-to-b from-white to-rose-50/40 border-t border-rose-100">
              
              {/* Promo Code Form */}
              <div className="mb-4">
                {cart.promoCode ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{cart.promoCode} ({cart.promoDiscountPercent ? `${cart.promoDiscountPercent}% off` : 'Free Delivery'})</span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-emerald-700 hover:text-red-500 text-[10px] font-bold uppercase tracking-wider underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      id="promo-code-input"
                      type="text"
                      placeholder="PROMO CODE"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value.toUpperCase());
                        if (promoError) setPromoError('');
                      }}
                      className="w-full bg-white text-slate-900 text-xs px-3.5 py-2 border border-rose-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-rose-200 focus:border-rose-400 placeholder:text-rose-300 placeholder:text-[10px] placeholder:tracking-wider font-mono uppercase"
                    />
                    <button
                      id="apply-promo-btn"
                      type="submit"
                      disabled={promoLoading || !promoInput.trim()}
                      className="bg-gradient-to-r from-rose-500 to-orange-500 text-white hover:from-rose-600 hover:to-orange-600 disabled:opacity-40 px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-xs cursor-pointer shrink-0"
                    >
                      {promoLoading ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {promoError && (
                  <p className="text-[10px] text-rose-600 mt-1 uppercase tracking-wider font-semibold">
                    {promoError}
                  </p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Subtotal
                  </span>
                  <span className="text-sm font-bold text-slate-900 font-mono">
                    ${cart.subtotal}.00
                  </span>
                </div>

                {cart.discount > 0 && (
                  <div className="flex justify-between items-center text-rose-600 text-xs">
                    <span className="font-bold uppercase tracking-wider text-[11px] text-rose-500">Special Discount</span>
                    <span className="font-mono font-bold">-${cart.discount}.00</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Shipping
                  </span>
                  <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider font-mono">
                    {cart.shipping === 0 ? 'Free' : `$${cart.shipping}.00`}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Estimated Tax
                  </span>
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    ${cart.tax}.00
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-rose-100">
                  <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-slate-900">
                    Total
                  </span>
                  <span className="text-lg font-black text-rose-600 font-mono">
                    ${cart.total}.00
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA Button */}
              <button
                id="checkout-btn"
                onClick={onProceedToCheckout}
                className="w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white py-4 rounded-xl text-xs font-bold tracking-[0.25em] uppercase hover:from-rose-600 hover:to-orange-600 transition-all shadow-lg shadow-rose-500/25 mb-3 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-slate-500 uppercase tracking-wider font-medium mb-3">
                ✨ Complimentary standard shipping on orders over $150
              </p>

              <div className="flex items-center justify-center">
                <button
                  id="cart-clear-btn"
                  onClick={onClearCart}
                  className="text-[10px] text-slate-400 hover:text-rose-600 uppercase tracking-wider transition-colors cursor-pointer underline underline-offset-4"
                >
                  Clear Bag
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
