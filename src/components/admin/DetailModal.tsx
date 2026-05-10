'use client'

import { useEffect, useState } from 'react'
import { utcToLocalTime } from '@/lib/timezone'
import type { ReservationRow } from '@/lib/types/admin'

type DetailModalProps = {
  isOpen: boolean
  onClose: () => void
  reservation: ReservationRow | null
  onConfirm?: () => void
}

const SERVICE_LABELS: Record<string, string> = {
  digitalisation: 'Digitalisation',
  saas: 'SaaS Builder',
  other: 'Autre',
}
const PROFILE_LABELS: Record<string, string> = {
  startup: 'Startup',
  pme: 'PME / TPE',
  freelance: 'Freelance',
  other: 'Autre',
}

const DEFAULT_ADMIN_TZ = 'America/Toronto'

function prettyDate(s: string) {
  const [y, m, dd] = s.split('-').map(Number)
  const d = new Date(y, (m ?? 1) - 1, dd ?? 1)
  return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function DetailModal({
  isOpen,
  onClose,
  reservation,
  onConfirm,
}: DetailModalProps) {
  const [adminTz, setAdminTz] = useState(DEFAULT_ADMIN_TZ)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAdminTz(localStorage.getItem('adminTimezone') || DEFAULT_ADMIN_TZ)
    }
  }, [])

  if (!reservation) {
    return (
      <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={onClose} />
    )
  }
  const r = reservation
  const adminView = utcToLocalTime(r.slot_date.slice(0, 10), r.slot_time.slice(0, 5), adminTz)
  const slotAdminLabel = `${prettyDate(adminView.localDate)} • ${adminView.localTime}`
  const visitorTz = r.visitor_timezone ?? null
  const showVisitor = visitorTz && visitorTz !== adminTz
  const visitorView = showVisitor
    ? utcToLocalTime(r.slot_date.slice(0, 10), r.slot_time.slice(0, 5), visitorTz)
    : null

  return (
    <div
      className={`modal-overlay${isOpen ? ' open' : ''}`}
      onClick={onClose}
    >
      <div className="modal" style={{ width: 500 }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{r.contact_name}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h4>Informations</h4>
            <div className="detail-grid">
              {[
                ['Email', r.contact_email],
                ['Service', SERVICE_LABELS[r.service] ?? r.service],
                ['Créneau', `${slotAdminLabel} (${adminTz})`, '#01EA62'],
                ['Profil', PROFILE_LABELS[r.profile] ?? r.profile],
                ['Téléphone', r.contact_phone ?? '—'],
                ['Entreprise', r.contact_company ?? '—'],
              ].map(([k, v, color]) => (
                <div key={k as string} className="detail-item">
                  <div className="key">{k as string}</div>
                  <div className="val" style={{ color: (color as string) ?? '#fff' }}>
                    {v as string}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {visitorView && (
            <div className="detail-section">
              <h4>Heure visiteur</h4>
              <div
                className="detail-item"
                style={{ background: 'rgba(96,165,250,0.08)' }}
              >
                <div className="key">{visitorTz}</div>
                <div className="val" style={{ color: '#60A5FA' }}>
                  {visitorView.localTime} le {prettyDate(visitorView.localDate)}
                </div>
              </div>
            </div>
          )}

          <div className="detail-section">
            <h4>Description du projet</h4>
            <div className="detail-note">{r.project_desc || '—'}</div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn cancel-btn" onClick={onClose}>
            Fermer
          </button>
          {r.status === 'pending' && onConfirm && (
            <button type="button" className="modal-btn success" onClick={onConfirm}>
              Confirmer & envoyer email
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
