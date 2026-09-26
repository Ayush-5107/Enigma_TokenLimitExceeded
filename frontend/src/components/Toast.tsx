import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

interface ToastItemProps {
  toast: ToastData;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const dur = toast.duration || 4000;
    const exitTimer = setTimeout(() => setIsExiting(true), dur - 300);
    const removeTimer = setTimeout(() => onDismiss(toast.id), dur);
    return () => {
      clearTimeout(exitTimer);
      clearTimeout(removeTimer);
    };
  }, [toast, onDismiss]);

  const iconMap = {
    success: <CheckCircle size={18} color="var(--success)" />,
    error: <XCircle size={18} color="var(--danger)" />,
    warning: <AlertTriangle size={18} color="var(--warning)" />,
    info: <Info size={18} color="var(--primary)" />
  };

  const bgMap = {
    success: '#ecfdf5',
    error: '#fff1f2',
    warning: '#fffbeb',
    info: '#e6f2f2'
  };

  const borderMap = {
    success: 'var(--success)',
    error: 'var(--danger)',
    warning: 'var(--warning)',
    info: 'var(--primary)'
  };

  return (
    <div style={{
      background: bgMap[toast.type],
      borderLeft: `4px solid ${borderMap[toast.type]}`,
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--neu-shadow-hover)',
      padding: '0.85rem 1rem',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      minWidth: '320px',
      maxWidth: '420px',
      animation: isExiting ? 'toast-exit 0.3s ease forwards' : 'toast-enter 0.35s ease forwards',
      border: '1px solid rgba(255, 255, 255, 0.8)'
    }}>
      <div style={{ flexShrink: 0, marginTop: '1px' }}>
        {iconMap[toast.type]}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.3 }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.35 }}>
            {toast.message}
          </div>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '2px',
          color: 'var(--text-dim)',
          flexShrink: 0
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastData[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '80px',
      right: '1.5rem',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.65rem',
      pointerEvents: 'none'
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};
