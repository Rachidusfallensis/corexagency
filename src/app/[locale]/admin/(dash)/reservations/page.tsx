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
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Skeleton from '@/components/admin/Skeleton'
import { useOptimistic } from 'react'
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
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 10

  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [reservations, setReservations] = useState<ReservationRow[]>([])
  
  const [optReservations, addOptReservation] = useOptimistic<ReservationRow[], { id: string; status: ReservationRow['status'] }>(
    reservations,
    (state, update) => state.map((r) => r.id === update.id ? { ...r, status: update.status } : r)
  )

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

  async function refresh(currentPage: number) {
    setLoading(true)
    try {
      const res = await getReservations({ page: currentPage, limit })
      setReservations(res.data)
      setTotal(res.total)
    } catch (err: any) {
      if (err.message?.includes('authentifié')) {
        toast.show('Session expirée', 'danger')
        router.push(`/${pathname.split('/')[1]}/admin/login`)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh(page)
  }, [page])

  const filtered = optReservations.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false
    if (serviceFilter !== 'all' && r.service !== serviceFilter) return false
    return true
  })

  function handleConfirm(id: string) {
    startTransition(async () => {
      addOptReservation({ id, status: 'confirmed' })
      const res = await confirmReservation(id)
      if (res.success) {
        toast.show('Rendez-vous confirmé — email envoyé', 'success')
        await refresh(page)
      } else {
        toast.show(res.error ?? 'Erreur', 'danger')
        await refresh(page) // rollback
      }
    })
  }

  function handleCancel(reason: string, withReschedule: boolean) {
    if (!cancelTarget) return
    const id = cancelTarget.id
    startTransition(async () => {
      setCancelTarget(null)
      addOptReservation({ id, status: 'cancelled' })
      const res = await cancelReservation(id, reason, withReschedule)
      if (res.success) {
        toast.show('Rendez-vous annulé — email envoyé', 'danger')
        await refresh(page)
      } else {
        toast.show(res.error ?? 'Erreur', 'danger')
        await refresh(page) // rollback
      }
    })
  }

  function setPage(p: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', p.toString())
    router.push(`${pathname}?${params.toString()}`)
  }
  const totalPages = Math.ceil(total / limit)

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

        <style>{`
          @media (max-width: 768px) {
            .reservations-table-wrap { display: none !important; }
            .reservations-mobile-cards { display: flex !important; }
          }
          .reservations-mobile-cards { display: none; flex-direction: column; gap: 0.75rem; padding: 0.75rem; }
        `}</style>

        {/* Mobile cards */}
        <div className="reservations-mobile-cards">
          {filtered.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '1.5rem', fontSize: '0.85rem' }}>
              Aucune réservation.
            </p>
          ) : (
            filtered.map((r) => {
              const adminView = utcToLocalTime(r.slot_date.slice(0, 10), r.slot_time.slice(0, 5), adminTz)
              const dPretty = parseLocal(adminView.localDate).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
              return (
                <div
                  key={`m-${r.id}`}
                  style={{
                    background: '#161616',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '12px',
                    padding: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{r.contact_name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{r.contact_email}</div>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.78rem' }}>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.4)' }}>Service</div>
                      <ServiceBadge service={r.service} />
                    </div>
                    <div>
                      <div style={{ color: 'rgba(255,255,255,0.4)' }}>Profil</div>
                      <div style={{ color: '#fff', fontWeight: 500 }}>{PROFILE_LABELS[r.profile] ?? r.profile}</div>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <div style={{ color: 'rgba(255,255,255,0.4)' }}>Créneau</div>
                      <div style={{ color: '#01EA62', fontWeight: 500 }}>{dPretty} • {adminView.localTime}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button type="button" className="action-btn view" onClick={() => setDetail(r)}>
                      Détail
                    </button>
                    {r.status === 'pending' && (
                      <button type="button" className="action-btn confirm" onClick={() => handleConfirm(r.id)} disabled={pending}>
                        Confirmer
                      </button>
                    )}
                    {r.status !== 'cancelled' && r.status !== 'rescheduled' && (
                      <button type="button" className="action-btn cancel" onClick={() => setCancelTarget(r)}>
                        Annuler
                      </button>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="reservations-table-wrap" style={{ overflowX: 'auto' }}>
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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    <td><Skeleton width="120px" height="18px" /><Skeleton width="150px" height="14px" style={{ marginTop: '4px' }} /></td>
                    <td><Skeleton width="100px" height="24px" borderRadius="12px" /></td>
                    <td><Skeleton width="80px" height="14px" /></td>
                    <td><Skeleton width="140px" height="18px" /></td>
                    <td><Skeleton width="90px" height="18px" /></td>
                    <td><Skeleton width="90px" height="24px" borderRadius="12px" /></td>
                    <td><Skeleton width="140px" height="32px" borderRadius="8px" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(255,255,255,0.4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <div>Aucune réservation trouvée.</div>
                    </div>
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
                        {r.status !== 'cancelled' && r.status !== 'rescheduled' && (
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

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '1rem 0' }}>
            <button
              className="action-btn view"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Précédent
            </button>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
              Page {page} / {totalPages}
            </span>
            <button
              className="action-btn view"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Suivant
            </button>
          </div>
        )}
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
