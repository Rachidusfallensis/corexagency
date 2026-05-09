'use client'

import Link from 'next/link'
import { useLocale } from 'next-intl'
import AdminSidebar from './AdminSidebar'
import { ToastProvider } from './Toast'

type AdminShellProps = {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export default function AdminShell({ title, subtitle, children }: AdminShellProps) {
  const locale = useLocale()
  return (
    <ToastProvider>
      <div
        className="grid h-screen overflow-hidden"
        style={{ gridTemplateColumns: '220px 1fr', background: '#0A0A0A' }}
      >
        <AdminSidebar />
        <main className="flex flex-col overflow-hidden">
          <div
            className="h-14 px-7 flex items-center justify-between shrink-0"
            style={{
              background: '#111111',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div>
              <h1 className="text-base font-semibold leading-tight">{title}</h1>
              {subtitle && (
                <p
                  className="text-[0.75rem] mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.25)' }}
                >
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Notifications"
                className="w-[34px] h-[34px] rounded-lg flex items-center justify-center relative"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span
                  className="absolute top-[7px] right-[7px] w-[7px] h-[7px] rounded-full"
                  style={{ background: '#EF4444', border: '1.5px solid #111' }}
                />
              </button>
              <Link
                href={`/${locale}`}
                className="px-3.5 py-1.5 rounded-lg text-[0.78rem] font-semibold flex items-center gap-1.5"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Voir le site
              </Link>
              <Link
                href={`/${locale}/admin/disponibilites`}
                className="px-3.5 py-1.5 rounded-lg text-[0.78rem] font-semibold flex items-center gap-1.5"
                style={{ background: '#01EA62', color: '#050505' }}
              >
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Nouvelle dispo
              </Link>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-7">{children}</div>
        </main>
      </div>
    </ToastProvider>
  )
}
