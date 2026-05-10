'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useLocale } from 'next-intl'

export default function NewDispoButton() {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const dispoHref = `/${locale}/admin/disponibilites`

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="topbar-btn primary"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Nouvelle dispo
      </button>

      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '20px',
              width: '460px',
              maxWidth: '90vw',
              padding: '1.5rem',
              position: 'relative',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
            }}
          >
            <h3
              style={{
                color: '#fff',
                fontSize: '0.95rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              Ajouter une disponibilité
            </h3>
            <p
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.85rem',
                marginBottom: '1.5rem',
                lineHeight: 1.6,
              }}
            >
              Gérez vos règles récurrentes et blocages depuis la page Disponibilités.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '9px',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                }}
              >
                Fermer
              </button>
              <Link
                href={dispoHref}
                onClick={() => setOpen(false)}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: '9px',
                  background: '#01EA62',
                  color: '#050505',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                Aller aux disponibilités →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
