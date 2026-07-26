import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700';
          let textColor = 'text-slate-800 dark:text-slate-100';
          let Icon = Info;
          let iconColor = 'text-clinical-500';

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-50/90 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-900';
            textColor = 'text-emerald-900 dark:text-emerald-100';
            Icon = CheckCircle;
            iconColor = 'text-emerald-500';
          } else if (toast.type === 'error') {
            bgColor = 'bg-red-50/90 dark:bg-red-950/80 border-red-200 dark:border-red-900';
            textColor = 'text-red-900 dark:text-red-100';
            Icon = AlertCircle;
            iconColor = 'text-red-500';
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-50/90 dark:bg-amber-950/80 border-amber-200 dark:border-amber-900';
            textColor = 'text-amber-900 dark:text-amber-100';
            Icon = AlertTriangle;
            iconColor = 'text-amber-500';
          }

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-glass dark:shadow-glass-dark animate-float transition-all duration-300 ${bgColor}`}
              role="alert"
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
              <div className="flex-1 text-sm font-medium leading-5">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`p-0.5 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors ${textColor}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
