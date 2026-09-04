import React, { useState } from 'react';
import { X, CheckCircle, Lock, CreditCard, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { CartState, CustomerInfo, Order } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartState;
  onPlaceOrder: (customer: CustomerInfo, paymentMethod: string) => Promise<Order>;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onPlaceOrder,
  onOrderSuccess
}) => {
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    address: '742 Evergreen Terrace',
    city: 'San Francisco',
    postalCode: '94107',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple-pay' | 'shop-pay'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.address || !customer.city) {
      setErrorMsg('Please complete all delivery details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const order = await onPlaceOrder(customer, paymentMethod === 'card' ? 'Visa •••• 4242' : paymentMethod);
      setConfirmedOrder(order);
      onOrderSuccess(order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process transaction.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[94vh] overflow-y-auto shadow-2xl border border-rose-100 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-checkout-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-rose-600 rounded-full hover:bg-rose-50 transition-colors cursor-pointer"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          /* Order Confirmation View */
          <div className="text-center py-4 space-y-6">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
                Transaction Confirmed & Database Synced
              </span>
              <h2 className="text-2xl font-bold text-slate-900">
                Thank you for your order! 🎉
              </h2>
              <p className="text-slate-500 text-xs mt-1">
                Receipt and tracking details dispatched to <strong className="text-rose-600 font-semibold">{confirmedOrder.customer.email}</strong>
              </p>
            </div>

            {/* Order Details Summary Box */}
            <div className="bg-gradient-to-br from-rose-50/50 via-amber-50/30 to-indigo-50/30 p-6 rounded-2xl border border-rose-100 text-left space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-rose-200/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-widest font-mono">Reference</span>
                  <strong className="font-mono text-rose-600 font-bold">{confirmedOrder.id}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-widest font-mono">Delivery</span>
                  <strong className="text-emerald-700 font-bold uppercase text-[10px]">3-5 Business Days (Free Express)</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] uppercase tracking-widest font-mono">Method</span>
                  <span className="text-slate-800 font-medium">{confirmedOrder.paymentMethod}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest block">
                  Purchased Items ({confirmedOrder.items.length})
                </span>
                {confirmedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs bg-white/70 p-2 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-2.5">
                      <img src={item.image} alt={item.name} className="w-9 h-11 object-cover rounded-lg border border-rose-100" />
                      <div>
                        <span className="font-bold uppercase tracking-wider text-[11px] text-slate-900 block">{item.name}</span>
                        <span className="text-slate-500 text-[10px] uppercase">{item.selectedColor} • {item.selectedSize} (Qty: {item.quantity})</span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900">${item.price * item.quantity}.00</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-3 border-t border-rose-200/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span className="uppercase tracking-wider text-[10px]">Subtotal</span>
                  <span className="font-mono">${confirmedOrder.subtotal}.00</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span className="uppercase tracking-wider text-[10px]">Discount</span>
                    <span className="font-mono">-${confirmedOrder.discount}.00</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span className="uppercase tracking-wider text-[10px]">Shipping</span>
                  <span className="font-mono uppercase text-emerald-600 font-bold">{confirmedOrder.shipping === 0 ? 'FREE' : `$${confirmedOrder.shipping}.00`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-rose-200 font-mono">
                  <span className="font-sans uppercase tracking-widest text-xs">Total Paid</span>
                  <span className="text-rose-600 text-base">${confirmedOrder.total}.00</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                id="done-checkout-btn"
                onClick={onClose}
                className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg shadow-rose-500/25 px-8 py-3.5 text-xs font-bold tracking-[0.25em] uppercase rounded-full transition-all cursor-pointer hover:scale-105 active:scale-95"
              >
                Return to Storefront
              </button>
            </div>
          </div>
        ) : (
          /* Active Checkout Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] text-rose-600 uppercase tracking-widest font-extrabold mb-1 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                <Lock className="w-3 h-3 text-rose-500" />
                <span>SSL Encrypted Checkout</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                Delivery & Payment
              </h2>
              <p className="text-slate-500 text-xs">
                Complete your details to record and synchronize your order.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Shipping Info Section */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                  <Truck className="w-3 h-3" />
                </div>
                <span>1. Shipping Details</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 uppercase tracking-wider text-[10px] font-bold mb-1">Full Name</label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full bg-rose-50/40 border border-rose-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 uppercase tracking-wider text-[10px] font-bold mb-1">Email Address</label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full bg-rose-50/40 border border-rose-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-300"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-600 uppercase tracking-wider text-[10px] font-bold mb-1">Street Address</label>
                  <input
                    id="checkout-address"
                    type="text"
                    required
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full bg-rose-50/40 border border-rose-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 uppercase tracking-wider text-[10px] font-bold mb-1">City</label>
                  <input
                    id="checkout-city"
                    type="text"
                    required
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full bg-rose-50/40 border border-rose-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 uppercase tracking-wider text-[10px] font-bold mb-1">Postal Code</label>
                  <input
                    id="checkout-zip"
                    type="text"
                    required
                    value={customer.postalCode}
                    onChange={(e) => setCustomer({ ...customer, postalCode: e.target.value })}
                    className="w-full bg-rose-50/40 border border-rose-200/80 rounded-xl px-3 py-2 text-slate-900 focus:outline-hidden focus:border-rose-500 focus:ring-1 focus:ring-rose-300 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Payment Info Section */}
            <div className="space-y-3 pt-4 border-t border-rose-100">
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <CreditCard className="w-3 h-3" />
                </div>
                <span>2. Payment Option</span>
              </h4>

              {/* Payment selector chips */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 border text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-transparent bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-xs'
                      : 'border-rose-200 bg-rose-50/40 text-slate-700 hover:bg-rose-50'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple-pay')}
                  className={`p-2.5 border text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'apple-pay'
                      ? 'border-transparent bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-xs'
                      : 'border-rose-200 bg-rose-50/40 text-slate-700 hover:bg-rose-50'
                  }`}
                >
                  <span>Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('shop-pay')}
                  className={`p-2.5 border text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'shop-pay'
                      ? 'border-transparent bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-xs'
                      : 'border-rose-200 bg-rose-50/40 text-slate-700 hover:bg-rose-50'
                  }`}
                >
                  <span>Shop Pay</span>
                </button>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="bg-rose-50/40 p-4 rounded-xl border border-rose-100 space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 uppercase tracking-wider text-[10px] font-bold mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-hidden focus:border-rose-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 uppercase tracking-wider text-[10px] font-bold mb-1">Expiration</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 uppercase tracking-wider text-[10px] font-bold mb-1">CVC</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-white border border-rose-200 rounded-lg px-3 py-2 text-slate-900 font-mono focus:outline-hidden focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary & Submit Button */}
            <div className="pt-4 border-t border-rose-100">
              <div className="bg-gradient-to-br from-rose-50/50 via-amber-50/30 to-indigo-50/30 p-4 rounded-xl border border-rose-100 mb-4 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span className="uppercase tracking-wider text-[10px]">Items ({cart.items.length})</span>
                  <span className="font-mono">${cart.subtotal}.00</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-semibold">
                    <span className="uppercase tracking-wider text-[10px]">Promo Code ({cart.promoCode})</span>
                    <span className="font-mono">-${cart.discount}.00</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-500">
                  <span className="uppercase tracking-wider text-[10px]">Shipping</span>
                  <span className="font-mono uppercase text-emerald-600 font-bold">{cart.shipping === 0 ? 'Free' : `$${cart.shipping}.00`}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span className="uppercase tracking-wider text-[10px]">Estimated Tax</span>
                  <span className="font-mono">${cart.tax}.00</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-rose-200 font-mono">
                  <span className="font-sans uppercase tracking-[0.2em] text-xs">Total</span>
                  <span className="text-rose-600">${cart.total}.00</span>
                </div>
              </div>

              <button
                id="place-order-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:to-orange-600 text-white font-bold text-xs tracking-[0.3em] uppercase rounded-xl transition-all shadow-lg shadow-rose-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 hover:scale-[1.01] active:scale-98"
              >
                {isSubmitting ? (
                  <span>Processing & Syncing...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-white" />
                    <span>Pay ${cart.total}.00 • Complete Order</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
