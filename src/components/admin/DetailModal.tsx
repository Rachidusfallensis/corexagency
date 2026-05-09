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
  if (!isOpen || !reservation) return null

  const r = reservation

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-[20px] w-[500px] max-w-[90vw] overflow-hidden"
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="text-[0.95rem] font-bold text-white">{r.contact_name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center text-white/50 hover:text-white"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="mb-5">
            <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-3" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Informations
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['Email', r.contact_email],
                ['Service', SERVICE_LABELS[r.service] ?? r.service],
                ['Créneau', formatSlot(r.slot_date, r.slot_time), '#01EA62'],
                ['Profil', PROFILE_LABELS[r.profile] ?? r.profile],
                ['Téléphone', r.contact_phone ?? '—'],
                ['Entreprise', r.contact_company ?? '—'],
              ].map(([k, v, color]) => (
                <div
                  key={k as string}
                  className="rounded-[8px] px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="text-[0.68rem]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                    {k as string}
                  </div>
                  <div
                    className="text-[0.82rem] font-medium"
                    style={{ color: (color as string) ?? '#fff' }}
                  >
                    {v as string}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Description du projet
            </h4>
            <div
              className="rounded-[8px] p-3.5 text-[0.82rem]"
              style={{
                background: 'rgba(255,255,255,0.03)',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.6,
                borderLeft: '2px solid #016B2D',
              }}
            >
              {r.project_desc || '—'}
            </div>
          </div>
        </div>

        <div
          className="flex justify-end gap-3 px-6 py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-[9px] text-[0.82rem] font-semibold"
            style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)' }}
          >
            Fermer
          </button>
          {r.status === 'pending' && onConfirm && (
            <button
              type="button"
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-[9px] text-[0.82rem] font-semibold"
              style={{ background: '#01EA62', color: '#050505' }}
            >
              Confirmer & envoyer email
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
