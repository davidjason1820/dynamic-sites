import React from 'react'
import { Check, AlertCircle } from 'lucide-react'

export interface ToastMessage {
  id: string
  title: string
  description?: string
  type?: 'success' | 'error' | 'info'
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null

  return (
    <div className="toast-portal" role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-card toast-${toast.type || 'success'}`}
          onClick={() => onDismiss(toast.id)}
        >
          <div className="toast-icon">
            {toast.type === 'error' ? (
              <AlertCircle size={16} />
            ) : (
              <Check size={16} />
            )}
          </div>
          <div className="toast-body">
            <span className="toast-title">{toast.title}</span>
            {toast.description && <span className="toast-desc">{toast.description}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
