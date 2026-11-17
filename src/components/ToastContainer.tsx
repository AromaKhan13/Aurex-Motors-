import React from 'react';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';
import { useAurex } from '../context/AurexContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useAurex();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 lg:bottom-4 right-4 z-50 flex flex-col gap-2 max-w-[300px] w-full pointer-events-none"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-surface-container-high/95 backdrop-blur-xl border border-primary/50 rounded-xl p-3 shadow-2xl flex items-start gap-2.5"
        >
          <div className="mt-0.5 text-primary shrink-0">
            {toast.variant === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : toast.variant === 'info' ? (
              <Info className="w-4 h-4" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-on-surface">{toast.title}</p>
            {toast.detail && (
              <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">{toast.detail}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="text-outline hover:text-on-surface"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
