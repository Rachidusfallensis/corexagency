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
import type { ReservationRow } from '@/lib/types/admin'

const PROFILE_LABELS: Record<string, string> = {
  startup: 'Startup',
  pme: 'PME / TPE',
  freelance: 'Freelance',
  other: 'Autre',
}

function formatSlot(date: string, time: string) {
  const d = new Date(date)
  return `${d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })} • ${time.slice(0, 5)}`
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', {
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

function ReservationsInner() {
  const toast = useToast()
  const [reservations, setReservations] = useState<ReservationRow[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [serviceFilter, setServiceFilter] = useState('all')
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
          <span className="text-[0.88rem] font-semibold">Toutes les réservations</span>
          <span
            className="text-[0.75rem]"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            {filtered.length} résultat{filtered.length > 1 ? 's' : ''}
          </span>
        </div>

        <div
          className="flex gap-2 px-5 py-3 flex-wrap"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {FILTERS.map((f) => {
            const active =
              (f.type === 'status' && statusFilter === f.value) ||
              (f.type === 'service' && serviceFilter === f.value)
            return (
              <button
                key={`${f.type}-${f.value}`}
                type="button"
                onClick={() =>
                  f.type === 'status'
                    ? setStatusFilter(f.value)
                    : setServiceFilter(f.value)
                }
                className="px-3 py-1.5 rounded-full text-[0.72rem] font-semibold transition-colors"
                style={{
                  background: active ? 'rgba(1,234,98,0.1)' : 'transparent',
                  color: active ? '#01EA62' : 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Contact', 'Service', 'Profil', 'Créneau', 'Reçu le', 'Statut', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[0.68rem] font-bold uppercase tracking-[0.07em] px-5 py-3 whitespace-nowrap"
                    style={{ color: 'rgba(255,255,255,0.25)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-[0.85rem]"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    Aucune réservation.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="text-[0.85rem] font-semibold">{r.contact_name}</div>
                      <div
                        className="text-[0.72rem]"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {r.contact_email}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <ServiceBadge service={r.service} />
                    </td>
                    <td
                      className="px-5 py-3.5 text-[0.75rem]"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {PROFILE_LABELS[r.profile] ?? r.profile}
                    </td>
                    <td
                      className="px-5 py-3.5 text-[0.8rem] whitespace-nowrap"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {formatSlot(r.slot_date, r.slot_time)}
                    </td>
                    <td
                      className="px-5 py-3.5 text-[0.8rem] whitespace-nowrap"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {formatDate(r.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setDetail(r)}
                          className="px-2.5 py-1.5 rounded-[7px] text-[0.72rem] font-semibold"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.5)',
                          }}
                        >
                          Détail
                        </button>
                        {r.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleConfirm(r.id)}
                            disabled={pending}
                            className="px-2.5 py-1.5 rounded-[7px] text-[0.72rem] font-semibold disabled:opacity-50"
                            style={{
                              background: 'rgba(1,234,98,0.1)',
                              color: '#01EA62',
                            }}
                          >
                            Confirmer
                          </button>
                        )}
                        {r.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(r)}
                            className="px-2.5 py-1.5 rounded-[7px] text-[0.72rem] font-semibold"
                            style={{
                              background: 'rgba(239,68,68,0.08)',
                              color: '#EF4444',
                            }}
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

