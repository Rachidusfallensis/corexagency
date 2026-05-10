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

const URGENCY_LABELS: Record<string, string> = {
  high: 'Urgent',
  medium: 'Moyen',
  low: 'Faible',
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
      : Math.round(waiting.reduce((sum, q) => sum + daysSince(q.created_at), 0) / waiting.length)

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .proto-admin .queue-grid { grid-template-columns: 1fr 1fr 1fr !important; gap: 0.5rem !important; }
          .proto-admin .queue-stat { padding: 0.75rem !important; }
          .proto-admin .queue-stat .num { font-size: 1.2rem !important; }
          .proto-admin .queue-item-header { padding: 0.75rem 0.85rem !important; }
          .proto-admin .queue-expand { padding: 0 0.85rem 0.85rem !important; }
        }
      `}</style>
      <div className="queue-grid">
        <div className="queue-stat">
          <div className="num">{waiting.length}</div>
          <div className="lbl">En attente</div>
        </div>
        <div className="queue-stat">
          <div className="num" style={{ color: '#FBBF24' }}>{highCount}</div>
          <div className="lbl">Urgence haute</div>
        </div>
        <div className="queue-stat">
          <div className="num" style={{ color: '#9CA3AF' }}>{avgDays}j</div>
          <div className="lbl">Attente moy.</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-header">
          <span className="card-title">Demandes en file d&apos;attente</span>
          <span className="card-action">Trier par urgence</span>
        </div>
        <div style={{ padding: '1rem' }}>
          {waiting.length === 0 ? (
            <p style={{ fontSize: '0.85rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '1.5rem' }}>
              File d&apos;attente vide.
            </p>
          ) : (
            waiting.map((q, i) => {
              const isOpen = expanded === q.id
              return (
                <div key={q.id} className="queue-item-card">
                  <button type="button" className="queue-item-header" onClick={() => setExpanded(isOpen ? null : q.id)}>
                    <div className="queue-item-left">
                      <div className="queue-rank">#{i + 1}</div>
                      <div>
                        <div className="queue-name">{q.contact_name}</div>
                        <div className="queue-meta">
                          {SERVICE_LABELS[q.service]} • {PROFILE_LABELS[q.profile]} • En attente depuis {daysSince(q.created_at)} jours
                        </div>
                      </div>
                    </div>
                    <span className={`urgency-badge ${q.urgency}`}>{URGENCY_LABELS[q.urgency]}</span>
                  </button>

                  {isOpen && (
                    <div className="queue-expand">
                      <div className="queue-desc">{q.project_desc || '(pas de description)'}</div>
                      <div className="queue-actions">
                        <button
                          type="button"
                          className="action-btn invite"
                          onClick={async () => {
                            const res = await inviteFromQueue(q.id)
                            if (res.success) {
                              toast.show(`Invitation envoyée à ${q.contact_name}`, 'success')
                              await refresh()
                            } else toast.show(res.error ?? 'Erreur', 'danger')
                          }}
                        >
                          Inviter à booker
                        </button>
                        <button
                          type="button"
                          className="action-btn cancel"
                          onClick={async () => {
                            const res = await rejectFromQueue(q.id)
                            if (res.success) {
                              toast.show('Demande rejetée', 'danger')
                              await refresh()
                            } else toast.show(res.error ?? 'Erreur', 'danger')
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

export default function FileAttentePage() {
  return (
    <AdminShell title="File d'attente" subtitle="Demandes en attente de créneau">
      <FileAttenteInner />
    </AdminShell>
  )
}
