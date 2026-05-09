'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { usePathname } from 'next/navigation'
import { LOGOS } from '@/lib/assets'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
  badge?: { value: string | number; variant?: 'default' | 'red' }
}

const ICON_BASE = {
  width: 15,
  height: 15,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export default function AdminSidebar() {
  const locale = useLocale()
  const pathname = usePathname()
  const base = `/${locale}/admin`

  const items: NavItem[] = [
    {
      href: base,
      label: "Vue d'ensemble",
      icon: (
        <svg {...ICON_BASE}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
    },
    {
      href: `${base}/reservations`,
      label: 'Réservations',
      icon: (
        <svg {...ICON_BASE}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      href: `${base}/disponibilites`,
      label: 'Disponibilités',
      icon: (
        <svg {...ICON_BASE}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      href: `${base}/file-attente`,
      label: "File d'attente",
      icon: (
        <svg {...ICON_BASE}>
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      ),
    },
    {
      href: `${base}/leads`,
      label: 'Leads',
      icon: (
        <svg {...ICON_BASE}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  return (
    <aside
      className="w-[220px] flex flex-col py-5 overflow-y-auto"
      style={{
        background: '#111111',
        borderRight: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="flex items-center gap-2.5 px-5 pb-5 mb-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="w-8 h-8 rounded-[9px] flex items-center justify-center overflow-hidden"
          style={{ background: '#016B2D' }}
        >
          <Image src={LOGOS.icon} alt="" width={20} height={20} />
        </div>
        <span className="text-base font-bold tracking-tight">Corex Admin</span>
      </div>

      <div className="px-3 mb-6">
        <div
          className="px-2 mb-1.5 text-[0.65rem] font-bold uppercase tracking-[0.1em]"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          Navigation
        </div>
        {items.map((it) => {
          const active =
            it.href === base ? pathname === base : pathname.startsWith(it.href)
          return (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[9px] text-[0.82rem] font-medium transition-colors"
              style={{
                background: active ? 'rgba(1,234,98,0.08)' : 'transparent',
                color: active ? '#01EA62' : 'rgba(255,255,255,0.5)',
              }}
            >
              <span style={{ opacity: active ? 1 : 0.7 }}>{it.icon}</span>
              {it.label}
              {it.badge && (
                <span
                  className="ml-auto text-[0.65rem] font-bold px-2 py-[0.15rem] rounded-full min-w-[18px] text-center"
                  style={
                    it.badge.variant === 'red'
                      ? {
                          background: 'rgba(239,68,68,0.15)',
                          color: '#EF4444',
                        }
                      : { background: '#016B2D', color: '#01EA62' }
                  }
                >
                  {it.badge.value}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      <div
        className="mt-auto px-3 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-[9px]"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <div
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[0.7rem] font-bold"
            style={{ background: '#016B2D', color: '#01EA62' }}
          >
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[0.78rem] font-semibold truncate">Admin Corex</div>
            <div
              className="text-[0.68rem]"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              Super Admin
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
