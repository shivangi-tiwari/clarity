'use client';

import { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const ToastComponent = toast ? (
    <div className={`toast toast-${toast.type}`}>
      {toast.type === 'success' ? '✓ ' : '✕ '}
      {toast.message}
    </div>
  ) : null;

  return { showToast, ToastComponent };
}
