'use client';

import { createContext, useContext } from 'react';
import { toast as sonnerToast } from 'sonner';

interface ToastContextType {
  success: (message: string, description?: string) => void;
  error: (message: string, description?: string) => void;
  info: (message: string, description?: string) => void;
  warning: (message: string, description?: string) => void;
  loading: (message: string) => string | number;
  promise: <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ) => Promise<T>;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const success = (message: string, description?: string) => {
    sonnerToast.success(message, {
      description,
      duration: 5000,
    });
  };

  const error = (message: string, description?: string) => {
    sonnerToast.error(message, {
      description,
      duration: 5000,
    });
  };

  const info = (message: string, description?: string) => {
    sonnerToast.info(message, {
      description,
      duration: 5000,
    });
  };

  const warning = (message: string, description?: string) => {
    sonnerToast.warning(message, {
      description,
      duration: 5000,
    });
  };

  const loading = (message: string) => {
    return sonnerToast.loading(message);
  };

  const promise = <T,>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: unknown) => string);
    }
  ): Promise<T> => {
    sonnerToast.promise(promise, options);
    return promise;
  };

  const value: ToastContextType = {
    success,
    error,
    info,
    warning,
    loading,
    promise,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
