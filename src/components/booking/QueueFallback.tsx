'use client'

import { useState } from 'react'
import { createQueueEntry } from '@/lib/booking/actions'
import type { BookingState, Urgency } from '@/lib/types/booking'

type QueueFallbackProps = {
  service: string
  profile: string
  projectDesc: string
  contact: BookingState['contact']
}

const URGENCIES: Array<{ value: Urgency; label: string }> = [
  { value: 'high', label: "Dans moins d'une semaine" },
  { value: 'medium', label: 'Dans le mois' },
  { value: 'low', label: 'Pas pressé' },
]

export default function QueueFallback({
  service,
  profile,
  projectDesc,
  contact,
}: QueueFallbackProps) {
  const [urgency, setUrgency] = useState<Urgency>('medium')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit() {
    setLoading(true)
    setError(null)
    const res = await createQueueEntry({
      service,
      profile,
      projectDesc,
      contact,
      urgency,
    })
    setLoading(false)
    if (res.success) {
      setSubmitted(true)
    } else {
      setError(res.error ?? 'Erreur')
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(1,234,98,0.12)',
            border: '2px solid #01EA62',
            animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth={2.5}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Vous êtes sur la liste !</h3>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Nous vous contacterons dès qu&apos;un créneau se libère.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-white">
        Aucun créneau disponible pour le moment
      </h2>
      <p
        className="text-[0.9rem] mb-6"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        Rejoignez la liste d&apos;attente — nous vous contactons dès qu&apos;un créneau se libère.
      </p>
      <div className="flex flex-col gap-2 mb-6">
        {URGENCIES.map((u) => (
          <button
            key={u.value}
            type="button"
            onClick={() => setUrgency(u.value)}
            className="flex items-center justify-between p-3 rounded-xl text-left text-white text-[0.9rem] transition-all"
            style={{
              border:
                urgency === u.value
                  ? '1.5px solid #01EA62'
                  : '1.5px solid rgba(255,255,255,0.1)',
              background:
                urgency === u.value
                  ? 'rgba(1,234,98,0.08)'
                  : 'rgba(255,255,255,0.03)',
            }}
          >
            {u.label}
            {urgency === u.value && (
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>
      {error ? (
        <p className="text-[0.85rem] mb-3" style={{ color: '#EF4444' }}>
          {error}
        </p>
      ) : null}
      <button
        type="button"
        onClick={submit}
        disabled={loading}
        className="w-full rounded-full py-3.5 font-bold text-corex-black bg-green-vivid disabled:opacity-50"
      >
        {loading ? 'Envoi…' : "Rejoindre la liste d'attente"}
      </button>
    </div>
  )
}
