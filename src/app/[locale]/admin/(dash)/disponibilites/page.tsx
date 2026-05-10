'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { useToast } from '@/components/admin/Toast'
import {
  addAvailabilityBlock,
  addAvailabilityRule,
  deleteAvailabilityBlock,
  deleteAvailabilityRule,
  getAvailabilityBlocks,
  getAvailabilityRules,
} from '@/lib/admin/actions'
import type {
  AvailabilityBlockRow,
  AvailabilityRuleRow,
} from '@/lib/types/admin'

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V']

function DaysPills({ days }: { days: number[] }) {
  return (
    <div className="rule-days">
      {DAY_LETTERS.map((letter, i) => (
        <span key={i} className={`rule-day ${days.includes(i) ? 'active' : 'inactive'}`}>
          {letter}
        </span>
      ))}
    </div>
  )
}

function AddRuleModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rule: { days_of_week: number[]; start_time: string; end_time: string; slot_duration: number }) => void
}) {
  const [days, setDays] = useState<number[]>([])
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('12:00')
  const [duration, setDuration] = useState(60)

  function toggleDay(i: number) {
    setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))
  }

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Ajouter une règle récurrente</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <label>Jours de la semaine</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {DAY_LETTERS.map((letter, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => toggleDay(i)}
                  className={`rule-day ${days.includes(i) ? 'active' : 'inactive'}`}
                  style={{ width: 36, height: 36, borderRadius: 8, fontSize: '0.78rem' }}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
          <div className="modal-field">
            <label>Heure de début</label>
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} style={{ colorScheme: 'dark' as const }} />
          </div>
          <div className="modal-field">
            <label>Heure de fin</label>
            <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} style={{ colorScheme: 'dark' as const }} />
          </div>
          <div className="modal-field">
            <label>Durée d&apos;un créneau</label>
            <select value={duration} onChange={(e) => setDuration(parseInt(e.target.value, 10))}>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={90}>1h30</option>
            </select>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="modal-btn cancel-btn" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="modal-btn success"
            onClick={() => onSubmit({ days_of_week: days, start_time: start, end_time: end, slot_duration: duration })}
            disabled={days.length === 0}
          >
            Enregistrer la règle
          </button>
        </div>
      </div>
    </div>
  )
}

function AddBlockModal({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (b: { start_date: string; end_date: string; reason: string }) => void
}) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')

  return (
    <div className={`modal-overlay${isOpen ? ' open' : ''}`} onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Bloquer une période</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-field">
            <label>Date de début</label>
            <input type="date" value={start} onChange={(e) => setStart(e.target.value)} style={{ colorScheme: 'dark' as const }} />
          </div>
          <div className="modal-field">
            <label>Date de fin</label>
            <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} style={{ colorScheme: 'dark' as const }} />
          </div>
          <div className="modal-field">
            <label>Motif <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none' }}>(interne)</span></label>
            <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Vacances, conférence..." />
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="modal-btn cancel-btn" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="modal-btn danger"
            onClick={() => onSubmit({ start_date: start, end_date: end || start, reason })}
            disabled={!start}
          >
            Bloquer la période
          </button>
        </div>
      </div>
    </div>
  )
}

function DispoInner() {
  const toast = useToast()
  const [rules, setRules] = useState<AvailabilityRuleRow[]>([])
  const [blocks, setBlocks] = useState<AvailabilityBlockRow[]>([])
  const [showRuleModal, setShowRuleModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)

  async function refresh() {
    const [r, b] = await Promise.all([getAvailabilityRules(), getAvailabilityBlocks()])
    setRules(r)
    setBlocks(b)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <>
      <div className="dispos-grid">
        {/* Rules */}
        <div className="dispo-card">
          <div className="dispo-header">
            <span className="dispo-title">Règles récurrentes</span>
            <button type="button" className="add-btn" onClick={() => setShowRuleModal(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Ajouter
            </button>
          </div>
          <div className="rule-list">
            {rules.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', padding: '0.75rem', textAlign: 'center' }}>
                Aucune règle. Ajoutez-en une pour générer des créneaux.
              </p>
            ) : (
              rules.map((r) => (
                <div key={r.id} className="rule-item">
                  <DaysPills days={r.days_of_week} />
                  <div className="rule-info">
                    <div className="rule-time">{r.start_time.slice(0, 5)} — {r.end_time.slice(0, 5)}</div>
                    <div className="rule-sub">Créneaux de {r.slot_duration} min</div>
                  </div>
                  <button
                    type="button"
                    className="rule-del"
                    onClick={async () => {
                      const res = await deleteAvailabilityRule(r.id)
                      if (res.success) {
                        toast.show('Règle supprimée', 'success')
                        await refresh()
                      } else toast.show(res.error ?? 'Erreur', 'danger')
                    }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Blocks */}
        <div className="dispo-card">
          <div className="dispo-header">
            <span className="dispo-title">Blocages</span>
            <button type="button" className="add-btn" onClick={() => setShowBlockModal(true)}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Bloquer
            </button>
          </div>
          <div className="rule-list">
            {blocks.length === 0 ? (
              <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', padding: '0.75rem', textAlign: 'center' }}>
                Aucun blocage en cours.
              </p>
            ) : (
              blocks.map((b) => {
                const startStr = new Date(b.start_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                const endStr = new Date(b.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
                return (
                  <div key={b.id} className="block-item">
                    <div>
                      <div className="block-dates">{startStr}{endStr !== startStr ? ` — ${endStr}` : ''}</div>
                      <div className="block-reason">{b.reason ?? '(sans motif)'}</div>
                    </div>
                    <button
                      type="button"
                      className="rule-del"
                      onClick={async () => {
                        const res = await deleteAvailabilityBlock(b.id)
                        if (res.success) {
                          toast.show('Blocage supprimé', 'success')
                          await refresh()
                        } else toast.show(res.error ?? 'Erreur', 'danger')
                      }}
                    >
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <AddRuleModal
        isOpen={showRuleModal}
        onClose={() => setShowRuleModal(false)}
        onSubmit={async (rule) => {
          const res = await addAvailabilityRule(rule)
          if (res.success) {
            toast.show('Règle ajoutée', 'success')
            setShowRuleModal(false)
            await refresh()
          } else toast.show(res.error ?? 'Erreur', 'danger')
        }}
      />

      <AddBlockModal
        isOpen={showBlockModal}
        onClose={() => setShowBlockModal(false)}
        onSubmit={async (b) => {
          const res = await addAvailabilityBlock(b)
          if (res.success) {
            toast.show('Période bloquée', 'success')
            setShowBlockModal(false)
            await refresh()
          } else toast.show(res.error ?? 'Erreur', 'danger')
        }}
      />
    </>
  )
}

export default function DisponibilitesPage() {
  return (
    <AdminShell title="Disponibilités" subtitle="Gérez vos créneaux">
      <DispoInner />
    </AdminShell>
  )
}
