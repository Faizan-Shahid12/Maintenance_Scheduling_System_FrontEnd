import { useState, useCallback } from 'react';

export type ToastSeverity = 'success' | 'error' | 'warning' | 'info';

export interface ToastState {
  open: boolean;
  message: string;
  severity: ToastSeverity;
  duration?: number;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
    duration: 6000
  });

  const showToast = useCallback((
    message: string, 
    severity: ToastSeverity = 'info', 
    duration?: number
  ) => {
    setToast({
      open: true,
      message,
      severity,
      duration: duration || 6000
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, open: false }));
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
