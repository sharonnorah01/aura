import React from 'react';
import { CheckCircle2, AlertCircle, ShoppingBag, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
  onOpenCart?: () => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onOpenCart
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl border shadow-xl transition-all animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === 'success'
              ? 'border-emerald-300 shadow-emerald-500/10'
              : toast.type === 'error'
              ? 'border-rose-400 shadow-rose-500/10'
              : 'border-indigo-300 shadow-indigo-500/10'
          }`}
        >
          {toast.type === 'success' ? (
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          ) : toast.type === 'error' ? (
            <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          ) : (
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-4 h-4" />
            </div>
          )}

          <div className="flex-1">
            <h4 className="font-extrabold text-xs uppercase tracking-wider leading-tight text-slate-900">{toast.title}</h4>
            {toast.description && (
              <p className="text-[11px] text-slate-500 mt-1 leading-snug font-normal">{toast.description}</p>
            )}

            {toast.type === 'success' && onOpenCart && (
              <button
                onClick={() => {
                  onOpenCart();
                  onDismiss(toast.id);
                }}
                className="mt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-rose-600 hover:text-orange-600 inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View Bag & Checkout →</span>
              </button>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 cursor-pointer transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
