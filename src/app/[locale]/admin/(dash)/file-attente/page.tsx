'use client'

import { useEffect, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { useToast } from '@/components/admin/Toast'
import {
  getQueue,
  inviteFromQueue,
  rejectFromQueue,
} from '@/lib/admin/actions'
import type { QueueRow } from '@/lib/types/admin'

const URGENCY_VARIANTS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  high: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', label: 'Urgent' },
  medium: { bg: 'rgba(251,191,36,0.1)', color: '#FBBF24', label: 'Moyen' },
  low: { bg: 'rgba(156,163,175,0.1)', color: '#9CA3AF', label: 'Faible' },
}

const SERVICE_LABELS: Record<string, string> = {
  digitalisation: 'Digitalisation',
  saas: 'SaaS Builder',
  other: 'Autre',
}
const PROFILE_LABELS: Record<string, string> = {
  startup: 'Startup',
  pme: 'PME',
  freelance: 'Freelance',
  other: 'Autre',
}

function daysSince(iso: string) {
  const ms = Date.now() - new Date(iso).getTime()
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

function FileAttenteInner() {
  const toast = useToast()
  const [queue, setQueue] = useState<QueueRow[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)

  async function refresh() {
    const data = await getQueue()
    setQueue(data)
  }

  useEffect(() => {
    refresh()
  }, [])

  const waiting = queue.filter((q) => q.status === 'waiting')
  const highCount = waiting.filter((q) => q.urgency === 'high').length
  const avgDays =
    waiting.length === 0
      ? 0
      : Math.round(
          waiting.reduce((sum, q) => sum + daysSince(q.created_at), 0) / waiting.length
        )

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
        <Stat label="En attente" value={waiting.length} color="#01EA62" />
        <Stat label="Urgence haute" value={highCount} color="#FBBF24" />
        <Stat label="Attente moy." value={`${avgDays}j`} color="#9CA3AF" />
      </div>

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
          <span className="text-[0.88rem] font-semibold">
            Demandes en file d&apos;attente
          </span>
        </div>
        <div className="p-4">
          {waiting.length === 0 ? (
            <p
              className="text-[0.85rem] py-6 text-center"
              style={{ color: 'rgba(255,255,255,0.3)' }}
            >
              File d&apos;attente vide.
            </p>
          ) : (
            waiting.map((q, i) => {
              const u = URGENCY_VARIANTS[q.urgency] ?? URGENCY_VARIANTS.medium
              const isOpen = expanded === q.id
              return (
                <div
                  key={q.id}
                  className="rounded-[18px] mb-3 overflow-hidden"
                  style={{
                    background: '#161616',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : q.id)}
                    className="w-full px-5 py-3.5 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className="w-[26px] h-[26px] rounded-[7px] flex items-center justify-center text-[0.72rem] font-bold"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          color: 'rgba(255,255,255,0.5)',
                        }}
                      >
                        #{i + 1}
                      </span>
                      <div className="text-left">
                        <div className="text-[0.85rem] font-semibold">
                          {q.contact_name}
                        </div>
                        <div
                          className="text-[0.72rem] mt-0.5"
                          style={{ color: 'rgba(255,255,255,0.5)' }}
                        >
                          {SERVICE_LABELS[q.service]} •{' '}
                          {PROFILE_LABELS[q.profile]} • En attente depuis {daysSince(q.created_at)}{' '}
                          jours
                        </div>
                      </div>
                    </div>
                    <span
                      className="text-[0.68rem] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: u.bg, color: u.color }}
                    >
                      {u.label}
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      className="px-5 pb-4"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <p
                        className="text-[0.8rem] my-3.5"
                        style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}
                      >
                        {q.project_desc || '(pas de description)'}
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await inviteFromQueue(q.id)
                            if (res.success) {
                              toast.show(
                                `Invitation envoyée à ${q.contact_name}`,
                                'success'
                              )
                              await refresh()
                            } else {
                              toast.show(res.error ?? 'Erreur', 'danger')
                            }
                          }}
                          className="px-3 py-1.5 rounded-[7px] text-[0.72rem] font-semibold"
                          style={{
                            background: 'rgba(1,234,98,0.1)',
                            color: '#01EA62',
                          }}
                        >
                          Inviter à booker
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            const res = await rejectFromQueue(q.id)
                            if (res.success) {
                              toast.show('Demande rejetée', 'danger')
                              await refresh()
                            } else {
                              toast.show(res.error ?? 'Erreur', 'danger')
                            }
                          }}
                          className="px-3 py-1.5 rounded-[7px] text-[0.72rem] font-semibold"
                          style={{
                            background: 'rgba(239,68,68,0.08)',
                            color: '#EF4444',
                          }}
                        >
                          Rejeter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}

function Stat({
  label,
  value,
  color,
}: {
  label: string
  value: number | string
  color: string
}) {
  return (
    <div
      className="rounded-[12px] p-4 text-center"
      style={{
        background: '#111111',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="text-[1.5rem] font-extrabold"
        style={{ color }}
      >
        {value}
      </div>
      <div
        className="text-[0.72rem] mt-0.5"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {label}
      </div>
    </div>
  )
}

export default function FileAttentePage() {
  return (
    <AdminShell title="File d'attente" subtitle="Demandes en attente de créneau">
      <FileAttenteInner />
    </AdminShell>
  )
}
