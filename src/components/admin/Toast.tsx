'use client'

import { createContext, useCallback, useContext, useState } from 'react'

type ToastVariant = 'success' | 'danger'
type Toast = { id: number; message: string; variant: ToastVariant }

type ToastContextValue = {
  show: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const show = useCallback((message: string, variant: ToastVariant = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, variant }])
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id))
    }, 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-[0.82rem] font-medium max-w-[320px]"
            style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              animation: 'fadeInUp 0.3s ease',
            }}
          >
            <span
              className="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0"
              style={{
                background:
                  t.variant === 'success'
                    ? 'rgba(1,234,98,0.15)'
                    : 'rgba(239,68,68,0.12)',
              }}
            >
              {t.variant === 'success' ? (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth={2.5}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth={2.5}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
