import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

type ToastListener = (toasts: Toast[]) => void;

let toastListeners: ToastListener[] = [];
let toastsList: Toast[] = [];

export const showToast = (message: string, type: Toast['type'] = 'success') => {
  const id = Math.random().toString();
  const newToast: Toast = { id, message, type };
  toastsList = [...toastsList, newToast];
  toastListeners.forEach(listener => listener(toastsList));

  // Dismiss timer
  setTimeout(() => {
    toastsList = toastsList.filter(t => t.id !== id);
    toastListeners.forEach(listener => listener(toastsList));
  }, 3500);
};

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    toastListeners.push(setToasts);
    setToasts(toastsList); // Sync initial values
    return () => {
      toastListeners = toastListeners.filter(listener => listener !== setToasts);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] space-y-2.5 max-w-sm w-full">
      {toasts.map((t) => {
        const typeClasses = {
          success: 'bg-emerald-950/80 border-emerald-900 text-emerald-400',
          error: 'bg-rose-950/80 border-rose-900 text-rose-400',
          info: 'bg-neutral-900/80 border-neutral-800 text-neutral-300',
        };

        const Icon = t.type === 'success' ? CheckCircle2 : AlertCircle;

        return (
          <div
            key={t.id}
            className={`flex items-center justify-between p-3.5 border rounded-lg shadow-2xl backdrop-blur-md text-xs transition-all duration-300 hover:scale-[1.01] ${typeClasses[t.type]}`}
          >
            <div className="flex items-center space-x-2.5">
              <Icon className="w-4 h-4 shrink-0" />
              <span className="font-medium">{t.message}</span>
            </div>
            <button
              onClick={() => {
                toastsList = toastsList.filter(item => item.id !== t.id);
                setToasts(toastsList);
              }}
              className="text-neutral-500 hover:text-neutral-300"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
