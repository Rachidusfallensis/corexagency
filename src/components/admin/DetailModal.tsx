'use client'

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

function formatSlot(date: string, time: string) {
  const d = new Date(date)
  return `${d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} • ${time.slice(0, 5)}`
}

export default function DetailModal({
  isOpen,
  onClose,
  reservation,
  onConfirm,
}: DetailModalProps) {
  if (!reservation) {
    return (
      <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={onClose} />
    )
  }
  const r = reservation

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
                ['Créneau', formatSlot(r.slot_date, r.slot_time), '#01EA62'],
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
