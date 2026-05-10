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
      className={`modal-overlay${isOpen ? ' open' : ''}`}
      onClick={onClose}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Annuler le rendez-vous</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-field">
            <label>Motif de l&apos;annulation <span style={{ color: '#EF4444' }}>*</span></label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Indisponibilité imprévue, changement de planning..."
            />
          </div>

          <div className="modal-field">
            <div className="toggle-row">
              <span>Proposer un nouveau créneau</span>
              <label className="toggle">
                <input
                  type="checkbox"
                  checked={withReschedule}
                  onChange={(e) => setWithReschedule(e.target.checked)}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>

          {withReschedule && (
            <div
              style={{
                marginTop: '0.75rem',
                background: 'rgba(1,234,98,0.06)',
                border: '1px solid rgba(1,234,98,0.15)',
                borderRadius: '10px',
                padding: '0.85rem',
                fontSize: '0.8rem',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              Un lien personnel de réservation sera généré et inclus dans l&apos;email d&apos;annulation.
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="modal-btn cancel-btn" onClick={onClose}>
            Retour
          </button>
          <button
            type="button"
            className="modal-btn danger"
            onClick={handleConfirm}
            disabled={!reason.trim() || submitting}
          >
            {submitting ? 'Annulation…' : "Confirmer l'annulation"}
          </button>
        </div>
      </div>
    </div>
  )
}
