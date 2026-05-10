'use client'

import { useEffect, useState, useTransition } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import StatusBadge from '@/components/admin/StatusBadge'
import ServiceBadge from '@/components/admin/ServiceBadge'
import CancelModal from '@/components/admin/CancelModal'
import DetailModal from '@/components/admin/DetailModal'
import { useToast } from '@/components/admin/Toast'
import {
  cancelReservation,
  confirmReservation,
  getReservations,
} from '@/lib/admin/actions'
import { utcToLocalTime } from '@/lib/timezone'
import type { ReservationRow } from '@/lib/types/admin'

const PROFILE_LABELS: Record<string, string> = {
  startup: 'Startup',
  pme: 'PME / TPE',
  freelance: 'Freelance',
  other: 'Autre',
}

function parseLocal(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}
function formatSlot(date: string, time: string) {
  const d = parseLocal(date)
  return `${d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} • ${time.slice(0, 5)}`
}
function formatDate(iso: string) {
  // created_at is full ISO timestamp; fine to parse via Date
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

const FILTERS: Array<{ value: string; label: string; type: 'status' | 'service' }> = [
  { value: 'all', label: 'Toutes', type: 'status' },
  { value: 'pending', label: 'En attente', type: 'status' },
  { value: 'confirmed', label: 'Confirmées', type: 'status' },
  { value: 'cancelled', label: 'Annulées', type: 'status' },
  { value: 'digitalisation', label: 'Digitalisation', type: 'service' },
  { value: 'saas', label: 'SaaS Builder', type: 'service' },
]

const DEFAULT_ADMIN_TZ = 'America/Toronto'

function ReservationsInner() {
  const toast = useToast()
  const [reservations, setReservations] = useState<ReservationRow[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [adminTz, setAdminTz] = useState(DEFAULT_ADMIN_TZ)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAdminTz(localStorage.getItem('adminTimezone') || DEFAULT_ADMIN_TZ)
    }
  }, [])
  const [detail, setDetail] = useState<ReservationRow | null>(null)
  const [cancelTarget, setCancelTarget] = useState<ReservationRow | null>(null)
  const [pending, startTransition] = useTransition()

  async function refresh() {
    const list = await getReservations()
    setReservations(list)
  }

  useEffect(() => {
    refresh()
  }, [])

  const filtered = reservations.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (serviceFilter !== 'all' && r.service !== serviceFilter) return false
    return true
  })

  function handleConfirm(id: string) {
    startTransition(async () => {
      const res = await confirmReservation(id)
      if (res.success) {
        toast.show('Rendez-vous confirmé — email envoyé', 'success')
        await refresh()
      } else {
        toast.show(res.error ?? 'Erreur', 'danger')
      }
    })
  }

  async function handleCancel(reason: string, withReschedule: boolean) {
    if (!cancelTarget) return
    const res = await cancelReservation(cancelTarget.id, reason, withReschedule)
    if (res.success) {
      toast.show('Rendez-vous annulé — email envoyé', 'danger')
      setCancelTarget(null)
      await refresh()
    } else {
      toast.show(res.error ?? 'Erreur', 'danger')
    }
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Toutes les réservations</span>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="filters">
          {FILTERS.map((f) => {
            const active =
              (f.type === 'status' && statusFilter === f.value) ||
              (f.type === 'service' && serviceFilter === f.value)
            return (
              <button
                key={`${f.type}-${f.value}`}
                type="button"
                className={`filter-btn${active ? ' active' : ''}`}
                onClick={() =>
                  f.type === 'status'
                    ? setStatusFilter(f.value)
                    : setServiceFilter(f.value)
                }
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Service</th>
                <th>Profil</th>
                <th>Créneau</th>
                <th>Reçu le</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>
                    Aucune réservation.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="res-name">{r.contact_name}</div>
                      <div className="res-email">{r.contact_email}</div>
                    </td>
                    <td><ServiceBadge service={r.service} /></td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        {PROFILE_LABELS[r.profile] ?? r.profile}
                      </span>
                    </td>
                    <td>
                      {(() => {
                        const adminView = utcToLocalTime(r.slot_date.slice(0, 10), r.slot_time.slice(0, 5), adminTz)
                        const dPretty = parseLocal(adminView.localDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
                        const adminLine = `${dPretty} • ${adminView.localTime}`
                        const visitorTz = r.visitor_timezone ?? null
                        const showVisitor = visitorTz && visitorTz !== adminTz
                        const visitorView = showVisitor
                          ? utcToLocalTime(r.slot_date.slice(0, 10), r.slot_time.slice(0, 5), visitorTz)
                          : null
                        return (
                          <>
                            <div className="res-date">{adminLine} <span style={{ opacity: 0.5 }}>({adminTz.split('/').pop()})</span></div>
                            {visitorView && (
                              <div className="res-date" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
                                → {visitorView.localTime} ({visitorTz!.split('/').pop()})
                              </div>
                            )}
                          </>
                        )
                      })()}
                    </td>
                    <td><div className="res-date">{formatDate(r.created_at)}</div></td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <div className="action-btns">
                        <button type="button" className="action-btn view" onClick={() => setDetail(r)}>
                          Détail
                        </button>
                        {r.status === 'pending' && (
                          <button
                            type="button"
                            className="action-btn confirm"
                            onClick={() => handleConfirm(r.id)}
                            disabled={pending}
                          >
                            Confirmer
                          </button>
                        )}
                        {r.status !== 'cancelled' && (
                          <button
                            type="button"
                            className="action-btn cancel"
                            onClick={() => setCancelTarget(r)}
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailModal
        isOpen={!!detail}
        reservation={detail}
        onClose={() => setDetail(null)}
        onConfirm={() => {
          if (detail) {
            handleConfirm(detail.id)
            setDetail(null)
          }
        }}
      />

      <CancelModal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancel}
      />
    </>
  )
}

export default function ReservationsPage() {
  return (
    <AdminShell title="Réservations" subtitle="Toutes les demandes">
      <ReservationsInner />
    </AdminShell>
  )
}
