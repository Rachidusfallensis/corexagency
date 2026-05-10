'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { useToast } from '@/components/admin/Toast'
import {
  addAvailabilityBlock,
  addAvailabilityRule,
  deleteAvailabilityBlock,
  deleteAvailabilityRule,
  getAvailabilityBlocks,
  getAvailabilityRules,
  getReservations,
} from '@/lib/admin/actions'
import {
  dateKey,
  generateSlots,
  isDateBlocked,
  parseISODate,
} from '@/lib/booking/availability'
import { localTimeToUTC } from '@/lib/timezone'
import { TIMEZONES } from '@/lib/types/booking'
import type {
  AvailabilityBlockRow,
  AvailabilityRuleRow,
  ReservationRow,
} from '@/lib/types/admin'

const DAY_LETTERS = ['L', 'M', 'M', 'J', 'V']
const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

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
  timezone,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (rule: { days_of_week: number[]; start_time: string; end_time: string; slot_duration: number; timezone: string }) => void
  timezone: string
}) {
  const [days, setDays] = useState<number[]>([])
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('12:00')
  const [duration, setDuration] = useState(60)

  function toggleDay(i: number) {
    setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))
  }

  // Preview UTC equivalent
  const today = new Date().toISOString().slice(0, 10)
  const utcPreview = (() => {
    try {
      const { utcTime } = localTimeToUTC(today, start, timezone)
      return utcTime
    } catch {
      return null
    }
  })()

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
          {utcPreview && (
            <div
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.5)',
                background: 'rgba(1,234,98,0.06)',
                border: '1px solid rgba(1,234,98,0.15)',
                borderRadius: '8px',
                padding: '0.6rem 0.75rem',
              }}
            >
              {start} {timezone} = {utcPreview} UTC
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="modal-btn cancel-btn" onClick={onClose}>
            Annuler
          </button>
          <button
            type="button"
            className="modal-btn success"
            onClick={() => onSubmit({ days_of_week: days, start_time: start, end_time: end, slot_duration: duration, timezone })}
            disabled={days.length === 0}
          >
            Enregistrer
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
  presetStart,
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (b: { start_date: string; end_date: string; reason: string }) => void
  presetStart?: string
}) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (isOpen && presetStart) {
      setStart(presetStart)
      setEnd(presetStart)
    }
  }, [isOpen, presetStart])

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
            Bloquer
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
  const [reservations, setReservations] = useState<ReservationRow[]>([])
  const [showRuleModal, setShowRuleModal] = useState(false)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [blockPreset, setBlockPreset] = useState<string | undefined>(undefined)
  const [adminTimezone, setAdminTimezone] = useState<string>('America/Toronto')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('adminTimezone') : null
    if (saved) setAdminTimezone(saved)
  }, [])

  function handleTimezoneChange(tz: string) {
    setAdminTimezone(tz)
    if (typeof window !== 'undefined') localStorage.setItem('adminTimezone', tz)
  }

  const today = useMemo(() => startOfDay(new Date()), [])
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  async function refresh() {
    const [r, b, res] = await Promise.all([
      getAvailabilityRules(),
      getAvailabilityBlocks(),
      getReservations(),
    ])
    setRules(r)
    setBlocks(b)
    setReservations(res)
  }

  useEffect(() => {
    refresh()
  }, [])

  const rulesForLib = rules.map((r) => ({
    id: r.id,
    days_of_week: r.days_of_week,
    start_time: r.start_time,
    end_time: r.end_time,
    slot_duration: r.slot_duration,
    valid_from: r.valid_from,
    valid_until: r.valid_until,
  }))
  const blocksForLib = blocks.map((b) => ({
    id: b.id,
    start_date: b.start_date,
    end_date: b.end_date,
  }))
  const reservationsForLib = reservations.map((r) => ({
    slot_date: r.slot_date,
    slot_time: r.slot_time,
    status: r.status,
  }))

  const firstDow = new Date(calYear, calMonth, 1).getDay()
  const offset = firstDow === 0 ? 6 : firstDow - 1
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()

  function changeMonth(delta: number) {
    const next = calYear * 12 + calMonth + delta
    setCalYear(Math.floor(next / 12))
    setCalMonth(((next % 12) + 12) % 12)
    setSelectedDate(null)
  }

  // Reservations indexed by date
  const reservationsByDate = useMemo(() => {
    const m: Record<string, ReservationRow[]> = {}
    for (const r of reservations) {
      if (r.status === 'cancelled') continue
      const d = parseISODate(r.slot_date)
      const k = dateKey(d)
      ;(m[k] ||= []).push(r)
    }
    return m
  }, [reservations])

  // Selected day slots
  const selDateObj = selectedDate
    ? (() => {
        const [y, m, d] = selectedDate.split('-').map(Number)
        return new Date(y, m - 1, d)
      })()
    : null
  const slots = selDateObj
    ? generateSlots(selDateObj, rulesForLib, reservationsForLib, blocksForLib)
    : []

  function dayStatus(date: Date) {
    const dow = date.getDay()
    if (dow === 0 || dow === 6) return 'weekend' as const
    if (date < today) return 'past' as const
    if (isDateBlocked(date, blocksForLib)) return 'blocked' as const
    const k = dateKey(date)
    const resCount = (reservationsByDate[k] ?? []).length
    if (resCount > 0) return 'reserved' as const
    const slots = generateSlots(date, rulesForLib, reservationsForLib, blocksForLib)
    if (slots.length > 0) return 'available' as const
    return 'empty' as const
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .proto-admin .dispo-layout{display:grid;grid-template-columns:400px 1fr;gap:1.25rem}
        .proto-admin .cal-month{background:#111;border:1px solid rgba(255,255,255,0.07);border-radius:18px;padding:1.25rem}
        .proto-admin .cal-month-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:1rem}
        .proto-admin .cal-month-title{font-size:1rem;font-weight:600}
        .proto-admin .cal-month-nav{display:flex;gap:6px}
        .proto-admin .cal-month-nav button{width:30px;height:30px;border-radius:8px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.07);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}
        .proto-admin .cal-month-nav button:hover{background:rgba(255,255,255,0.08)}
        .proto-admin .cal-month-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
        .proto-admin .cal-dow{font-size:0.65rem;font-weight:700;text-align:center;color:rgba(255,255,255,0.3);text-transform:uppercase;padding:0.3rem 0}
        .proto-admin .cal-cell{aspect-ratio:1;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:0.85rem;cursor:pointer;transition:all 0.15s;border:1.5px solid transparent;position:relative}
        .proto-admin .cal-cell.empty{cursor:default}
        .proto-admin .cal-cell.past{color:rgba(255,255,255,0.15);cursor:not-allowed}
        .proto-admin .cal-cell.weekend{background:rgba(255,255,255,0.02);color:rgba(255,255,255,0.2);cursor:not-allowed}
        .proto-admin .cal-cell.blocked{background:rgba(239,68,68,0.08);color:#EF4444;cursor:pointer}
        .proto-admin .cal-cell.reserved{background:rgba(96,165,250,0.1);color:#60A5FA;cursor:pointer}
        .proto-admin .cal-cell.available{background:rgba(1,234,98,0.06);color:rgba(255,255,255,0.7);cursor:pointer}
        .proto-admin .cal-cell.available:hover{background:rgba(1,234,98,0.12);color:#fff;border-color:rgba(1,234,98,0.3)}
        .proto-admin .cal-cell.reserved:hover{background:rgba(96,165,250,0.15);border-color:rgba(96,165,250,0.3)}
        .proto-admin .cal-cell.empty-cell{color:rgba(255,255,255,0.25);cursor:pointer}
        .proto-admin .cal-cell.empty-cell:hover{background:rgba(255,255,255,0.04)}
        .proto-admin .cal-cell.selected{border-color:#01EA62;background:rgba(1,234,98,0.18);color:#01EA62;font-weight:700}
        .proto-admin .cal-cell-dot{position:absolute;bottom:4px;width:4px;height:4px;border-radius:50%}
        .proto-admin .cal-cell-count{position:absolute;top:3px;right:5px;font-size:0.55rem;font-weight:700}
        .proto-admin .cal-legend{display:flex;gap:1rem;margin-top:1rem;font-size:0.7rem;color:rgba(255,255,255,0.4);flex-wrap:wrap}
        .proto-admin .legend-dot{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:middle}
        .proto-admin .day-detail{margin-top:1rem;padding:1rem;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.07)}
        .proto-admin .day-detail h4{font-size:0.85rem;font-weight:600;margin-bottom:0.75rem}
        .proto-admin .day-slot{display:flex;align-items:center;justify-content:space-between;padding:0.55rem 0.75rem;border-radius:8px;background:rgba(255,255,255,0.03);margin-bottom:0.4rem;font-size:0.82rem}
        .proto-admin .day-slot.taken{background:rgba(96,165,250,0.08);color:#60A5FA}
        .proto-admin .day-slot.free{color:rgba(255,255,255,0.85)}
        .proto-admin .day-slot-time{font-weight:600}
        .proto-admin .day-slot-status{font-size:0.72rem;color:rgba(255,255,255,0.5)}
        @media(max-width:1100px){.proto-admin .dispo-layout{grid-template-columns:1fr}}
        @media(max-width:768px){
          .proto-admin .dispos-grid{grid-template-columns:1fr !important}
          .proto-admin .cal-cell{font-size:0.7rem}
          .proto-admin .cal-cell-count{font-size:0.5rem}
          .proto-admin .cal-month{padding:0.85rem}
        }
      ` }} />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.85rem 1.25rem',
          background: 'rgba(1,234,98,0.06)',
          border: '1px solid rgba(1,234,98,0.15)',
          borderRadius: '12px',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
          🌍 Votre fuseau horaire actuel :
        </span>
        <select
          value={adminTimezone}
          onChange={(e) => handleTimezoneChange(e.target.value)}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '0.4rem 0.75rem',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        >
          {TIMEZONES.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.flag} {tz.label} ({tz.offset})
            </option>
          ))}
        </select>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>
          Les créneaux seront stockés en UTC et convertis pour les visiteurs.
        </span>
      </div>

      <div className="dispo-layout">
        {/* COL gauche : règles + blocages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                  Aucune règle.
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

          <div className="dispo-card">
            <div className="dispo-header">
              <span className="dispo-title">Blocages</span>
              <button type="button" className="add-btn" onClick={() => { setBlockPreset(undefined); setShowBlockModal(true) }}>
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
                  Aucun blocage.
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

        {/* COL droite : calendrier mensuel */}
        <div className="cal-month">
          <div className="cal-month-head">
            <div className="cal-month-title">{MONTHS[calMonth]} {calYear}</div>
            <div className="cal-month-nav">
              <button type="button" onClick={() => changeMonth(-1)} aria-label="Mois précédent">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button type="button" onClick={() => changeMonth(1)} aria-label="Mois suivant">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          <div className="cal-month-grid">
            {DAY_LABELS.map((d, i) => (
              <div key={i} className="cal-dow">{d}</div>
            ))}
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`e-${i}`} className="cal-cell empty" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1
              const date = new Date(calYear, calMonth, d)
              const k = dateKey(date)
              const status = dayStatus(date)
              const resCount = reservationsByDate[k]?.length ?? 0
              const isSelected = selectedDate === k
              const cls = `cal-cell ${status}${isSelected ? ' selected' : ''}`
              const disabled = status === 'past' || status === 'weekend' || status === 'empty'
              return (
                <div
                  key={k}
                  className={cls}
                  onClick={() => {
                    if (disabled) return
                    setSelectedDate(k)
                  }}
                >
                  {d}
                  {resCount > 0 && <span className="cal-cell-count">{resCount}</span>}
                  {status === 'available' && <span className="cal-cell-dot" style={{ background: '#01EA62' }} />}
                  {status === 'reserved' && <span className="cal-cell-dot" style={{ background: '#60A5FA' }} />}
                  {status === 'blocked' && <span className="cal-cell-dot" style={{ background: '#EF4444' }} />}
                </div>
              )
            })}
          </div>

          <div className="cal-legend">
            <span><span className="legend-dot" style={{ background: 'rgba(1,234,98,0.4)' }} />Disponible</span>
            <span><span className="legend-dot" style={{ background: 'rgba(96,165,250,0.4)' }} />Réservé</span>
            <span><span className="legend-dot" style={{ background: 'rgba(239,68,68,0.4)' }} />Bloqué</span>
            <span><span className="legend-dot" style={{ background: 'rgba(255,255,255,0.1)' }} />Weekend</span>
          </div>

          {/* Day detail */}
          {selectedDate && selDateObj && (
            <div className="day-detail">
              <h4>
                {selDateObj.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </h4>
              {slots.length === 0 ? (
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                  Aucun créneau ce jour-là.
                </p>
              ) : (
                <div>
                  {slots.map((s) => {
                    const dayRes = reservationsByDate[selectedDate] ?? []
                    const taken = dayRes.find((r) => r.slot_time.slice(0, 5) === s.time)
                    return (
                      <div key={s.time} className={`day-slot ${taken ? 'taken' : 'free'}`}>
                        <span className="day-slot-time">{s.time}</span>
                        <span className="day-slot-status">
                          {taken ? `Réservé — ${taken.contact_name}` : 'Libre ✓'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="action-btn cancel"
                  onClick={() => {
                    setBlockPreset(selectedDate)
                    setShowBlockModal(true)
                  }}
                >
                  Bloquer ce jour
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddRuleModal
        isOpen={showRuleModal}
        timezone={adminTimezone}
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
        presetStart={blockPreset}
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
