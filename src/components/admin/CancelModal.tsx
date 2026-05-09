'use client'

import { useState } from 'react'

type CancelModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string, withReschedule: boolean) => void | Promise<void>
}

export default function CancelModal({ isOpen, onClose, onConfirm }: CancelModalProps) {
  const [reason, setReason] = useState('')
  const [withReschedule, setWithReschedule] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  async function handleConfirm() {
    if (!reason.trim()) return
    setSubmitting(true)
    await onConfirm(reason, withReschedule)
    setSubmitting(false)
    setReason('')
    setWithReschedule(false)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-[20px] w-[460px] max-w-[90vw] overflow-hidden"
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="text-[0.95rem] font-bold text-white">Annuler le rendez-vous</h3>
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
          <label
            className="block text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-2"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            Motif de l&apos;annulation <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Indisponibilité imprévue, changement de planning..."
            className="w-full rounded-[10px] px-3.5 py-2.5 text-[0.85rem] text-white outline-none resize-none mb-5"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1.5px solid rgba(255,255,255,0.07)',
              fontFamily: 'inherit',
            }}
          />

          <label
            className="flex items-center justify-between p-3 rounded-[10px] cursor-pointer"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <span className="text-[0.82rem] font-medium text-white">
              Proposer un nouveau créneau
            </span>
            <span
              className="relative w-[38px] h-[22px] rounded-full transition-colors"
              style={{
                background: withReschedule ? '#016B2D' : 'rgba(255,255,255,0.1)',
              }}
            >
              <input
                type="checkbox"
                checked={withReschedule}
                onChange={(e) => setWithReschedule(e.target.checked)}
                className="sr-only"
              />
              <span
                className="absolute top-[3px] w-4 h-4 rounded-full transition-all"
                style={{
                  left: withReschedule ? '19px' : '3px',
                  background: withReschedule ? '#01EA62' : '#fff',
                }}
              />
            </span>
          </label>

          {withReschedule && (
            <div
              className="mt-3 p-3 rounded-[10px] text-[0.8rem]"
              style={{
                background: 'rgba(1,234,98,0.06)',
                border: '1px solid rgba(1,234,98,0.15)',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Un lien personnel de réservation sera généré et inclus dans l&apos;email d&apos;annulation.
            </div>
          )}
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
            Retour
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!reason.trim() || submitting}
            className="px-5 py-2.5 rounded-[9px] text-[0.82rem] font-semibold disabled:opacity-50"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
          >
            {submitting ? 'Annulation…' : "Confirmer l'annulation"}
          </button>
        </div>
      </div>
    </div>
  )
}
