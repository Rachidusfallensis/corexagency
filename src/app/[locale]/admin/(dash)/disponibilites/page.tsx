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
    <div className="flex gap-[3px]">
      {DAY_LETTERS.map((letter, i) => {
        const active = days.includes(i)
        return (
          <span
            key={i}
            className="w-[22px] h-[22px] rounded-[5px] flex items-center justify-center text-[0.65rem] font-bold"
            style={{
              background: active ? 'rgba(1,234,98,0.15)' : 'rgba(255,255,255,0.04)',
              color: active ? '#01EA62' : 'rgba(255,255,255,0.25)',
            }}
          >
            {letter}
          </span>
        )
      })}
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
  onSubmit: (rule: {
    days_of_week: number[]
    start_time: string
    end_time: string
    slot_duration: number
  }) => void
}) {
  const [days, setDays] = useState<number[]>([])
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('12:00')
  const [duration, setDuration] = useState(60)

  if (!isOpen) return null

  function toggleDay(i: number) {
    setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i]))
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
          <h3 className="text-[0.95rem] font-bold">Ajouter une règle récurrente</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center text-white/50"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            ✕
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label
              className="block text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-2"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Jours de la semaine
            </label>
            <div className="flex gap-1.5">
              {DAY_LETTERS.map((letter, i) => {
                const active = days.includes(i)
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleDay(i)}
                    className="w-9 h-9 rounded-lg text-[0.78rem] font-bold transition-colors"
                    style={{
                      background: active ? 'rgba(1,234,98,0.15)' : 'transparent',
                      color: active ? '#01EA62' : 'rgba(255,255,255,0.25)',
                      border: '1px solid rgba(255,255,255,0.07)',
                    }}
                  >
                    {letter}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                className="block text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-2"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Heure début
              </label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.85rem] text-white outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1.5px solid rgba(255,255,255,0.07)',
                  colorScheme: 'dark',
                }}
              />
            </div>
            <div>
              <label
                className="block text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-2"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Heure fin
              </label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full rounded-[10px] px-3 py-2.5 text-[0.85rem] text-white outline-none"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1.5px solid rgba(255,255,255,0.07)',
                  colorScheme: 'dark',
                }}
              />
            </div>
          </div>
          <div>
            <label
              className="block text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-2"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Durée d&apos;un créneau
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10))}
              className="w-full rounded-[10px] px-3 py-2.5 text-[0.85rem] text-white outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.07)',
              }}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={90}>1h30</option>
            </select>
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
            Annuler
          </button>
          <button
            type="button"
            onClick={() =>
              onSubmit({
                days_of_week: days,
                start_time: start,
                end_time: end,
                slot_duration: duration,
              })
            }
            disabled={days.length === 0}
            className="px-5 py-2.5 rounded-[9px] text-[0.82rem] font-semibold disabled:opacity-50"
            style={{ background: '#01EA62', color: '#050505' }}
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
}: {
  isOpen: boolean
  onClose: () => void
  onSubmit: (b: { start_date: string; end_date: string; reason: string }) => void
}) {
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rounded-[20px] w-[460px] max-w-[90vw]"
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="text-[0.95rem] font-bold">Bloquer une période</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center text-white/50"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            ✕
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Date début
            </label>
            <input
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full rounded-[10px] px-3 py-2.5 text-[0.85rem] text-white outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                colorScheme: 'dark',
              }}
            />
          </div>
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Date fin
            </label>
            <input
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full rounded-[10px] px-3 py-2.5 text-[0.85rem] text-white outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                colorScheme: 'dark',
              }}
            />
          </div>
          <div>
            <label className="block text-[0.72rem] font-bold uppercase tracking-[0.07em] mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Motif <span className="font-normal normal-case opacity-50">(interne)</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Vacances, conférence..."
              className="w-full rounded-[10px] px-3 py-2.5 text-[0.85rem] text-white outline-none resize-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.07)',
                fontFamily: 'inherit',
              }}
            />
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
            Annuler
          </button>
          <button
            type="button"
            onClick={() =>
              onSubmit({
                start_date: start,
                end_date: end || start,
                reason,
              })
            }
            disabled={!start}
            className="px-5 py-2.5 rounded-[9px] text-[0.82rem] font-semibold disabled:opacity-50"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
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
    const [r, b] = await Promise.all([
      getAvailabilityRules(),
      getAvailabilityBlocks(),
    ])
    setRules(r)
    setBlocks(b)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Rules */}
        <div
          className="rounded-[18px] overflow-hidden"
          style={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="text-[0.85rem] font-semibold">Règles récurrentes</span>
            <button
              type="button"
              onClick={() => setShowRuleModal(true)}
              className="px-3 py-1 rounded-[7px] text-[0.72rem] font-semibold flex items-center gap-1.5"
              style={{ background: 'rgba(1,234,98,0.1)', color: '#01EA62' }}
            >
              + Ajouter
            </button>
          </div>
          <div className="p-3">
            {rules.length === 0 ? (
              <p
                className="text-[0.82rem] p-3 text-center"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Aucune règle. Ajoutez-en une pour générer des créneaux.
              </p>
            ) : (
              rules.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center gap-3 p-3 rounded-[9px] mb-2"
                  style={{
                    background: '#161616',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <DaysPills days={r.days_of_week} />
                  <div className="flex-1">
                    <div className="text-[0.78rem] font-semibold">
                      {r.start_time.slice(0, 5)} — {r.end_time.slice(0, 5)}
                    </div>
                    <div
                      className="text-[0.68rem]"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      Créneaux de {r.slot_duration} min
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      const res = await deleteAvailabilityRule(r.id)
                      if (res.success) {
                        toast.show('Règle supprimée', 'success')
                        await refresh()
                      } else {
                        toast.show(res.error ?? 'Erreur', 'danger')
                      }
                    }}
                    className="w-6 h-6 rounded-md flex items-center justify-center text-[0.7rem]"
                    style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Blocks */}
        <div
          className="rounded-[18px] overflow-hidden"
          style={{
            background: '#111111',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <span className="text-[0.85rem] font-semibold">Blocages</span>
            <button
              type="button"
              onClick={() => setShowBlockModal(true)}
              className="px-3 py-1 rounded-[7px] text-[0.72rem] font-semibold flex items-center gap-1.5"
              style={{ background: 'rgba(1,234,98,0.1)', color: '#01EA62' }}
            >
              + Bloquer
            </button>
          </div>
          <div className="p-3">
            {blocks.length === 0 ? (
              <p
                className="text-[0.82rem] p-3 text-center"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Aucun blocage en cours.
              </p>
            ) : (
              blocks.map((b) => {
                const startStr = new Date(b.start_date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
                const endStr = new Date(b.end_date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })
                return (
                  <div
                    key={b.id}
                    className="flex items-center justify-between p-3 rounded-[9px] mb-2"
                    style={{
                      background: '#161616',
                      border: '1px solid rgba(239,68,68,0.15)',
                    }}
                  >
                    <div>
                      <div
                        className="text-[0.78rem] font-semibold"
                        style={{ color: '#EF4444' }}
                      >
                        {startStr} {endStr !== startStr ? `— ${endStr}` : ''}
                      </div>
                      <div
                        className="text-[0.68rem]"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {b.reason ?? '(sans motif)'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await deleteAvailabilityBlock(b.id)
                        if (res.success) {
                          toast.show('Blocage supprimé', 'success')
                          await refresh()
                        } else {
                          toast.show(res.error ?? 'Erreur', 'danger')
                        }
                      }}
                      className="w-6 h-6 rounded-md flex items-center justify-center text-[0.7rem]"
                      style={{ background: 'rgba(239,68,68,0.08)', color: '#EF4444' }}
                    >
                      ✕
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
          } else {
            toast.show(res.error ?? 'Erreur', 'danger')
          }
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
          } else {
            toast.show(res.error ?? 'Erreur', 'danger')
          }
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
