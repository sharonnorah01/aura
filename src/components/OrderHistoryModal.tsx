import React, { useEffect, useState } from 'react';
import { X, Clock, CheckCircle2, RefreshCw, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { api } from '../services/api';

interface OrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshOrders?: () => void;
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  isOpen,
  onClose,
  onRefreshOrders
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Failed to load order history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-rose-100 p-6 sm:p-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-rose-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                Order History & Cloud Sync
              </h3>
              <p className="text-indigo-600 text-xs font-medium">
                Live orders synchronized with server database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors cursor-pointer"
              title="Refresh orders"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
              <span className="font-semibold">Querying live database records...</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 px-4 bg-gradient-to-br from-rose-50/50 via-amber-50/30 to-indigo-50/30 rounded-2xl border border-rose-100">
              <div className="w-12 h-12 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-800 mb-1">
                No Orders Yet
              </h4>
              <p className="text-slate-500 text-xs max-w-xs mx-auto">
                Complete a purchase through checkout to view synchronized live orders here!
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-rose-50/30 hover:bg-rose-50/50 p-5 rounded-2xl border border-rose-100/90 space-y-3 transition-all"
              >
                {/* Top Row: Order ID, Date, Status */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-rose-200/70 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase block tracking-wider">Order ID</span>
                    <span className="font-mono font-extrabold text-rose-600">{order.id}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-[11px] font-mono">
                      {new Date(order.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-white/70 p-2 rounded-xl border border-rose-100/60">
                      <div className="flex items-center gap-2.5">
                        <img src={item.image} alt={item.name} className="w-9 h-11 object-cover rounded-lg border border-rose-100" />
                        <div>
                          <span className="font-bold uppercase tracking-wider text-[11px] text-slate-900 block">{item.name}</span>
                          <span className="text-slate-500 text-[10px] uppercase">
                            {item.selectedColor} • {item.selectedSize} × {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900">${item.price * item.quantity}.00</span>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-2.5 border-t border-rose-200/70 flex flex-wrap items-center justify-between text-xs gap-2">
                  <span className="text-slate-500 text-[11px]">
                    Recipient: <strong className="text-slate-800 font-semibold">{order.customer.name}</strong> ({order.customer.city})
                  </span>
                  <div className="text-right font-mono font-extrabold text-slate-900">
                    <span className="text-slate-400 mr-2 text-[10px] uppercase tracking-wider font-sans font-bold">Total</span>
                    <span className="text-rose-600 text-sm">${order.total}.00</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-rose-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
