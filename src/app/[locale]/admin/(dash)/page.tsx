import AdminShell from '@/components/admin/AdminShell'
import StatCard from '@/components/admin/StatCard'
import StatusBadge from '@/components/admin/StatusBadge'
import ServiceBadge from '@/components/admin/ServiceBadge'
import { getReservations, getStats } from '@/lib/admin/actions'

const today = new Date().toLocaleDateString('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

function parseLocal(s: string) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}
function formatSlot(date: string, time: string) {
  const d = parseLocal(date)
  const day = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  return { day, time: time.slice(0, 5) }
}

export default async function AdminOverview() {
  const [stats, reservations] = await Promise.all([
    getStats(),
    getReservations(),
  ])

  const recent = reservations.slice(0, 5)
  const upcoming = reservations
    .filter((r) => r.status === 'confirmed')
    .filter((r) => parseLocal(r.slot_date) >= (() => { const t = new Date(); t.setHours(0,0,0,0); return t })())
    .sort((a, b) =>
      `${a.slot_date} ${a.slot_time}`.localeCompare(`${b.slot_date} ${b.slot_time}`)
    )
    .slice(0, 3)

  return (
    <AdminShell title="Vue d'ensemble" subtitle={today}>
      <div className="stats-row">
        <StatCard
          value={stats.pending}
          label="Réservations en attente"
          iconVariant="orange"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          trend="À traiter"
          trendVariant="neutral"
        />
        <StatCard
          value={stats.confirmed}
          label="RV confirmés (mois)"
          iconVariant="blue"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
          trend="Ce mois"
          trendVariant="up"
        />
        <StatCard
          value={stats.queue}
          label="Demandes en file"
          iconVariant="orange"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FB923C" strokeWidth="2">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
            </svg>
          }
          trend="File d'attente"
          trendVariant="neutral"
        />
        <StatCard
          value={stats.leads}
          label="Leads reçus"
          iconVariant="purple"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
            </svg>
          }
          trend="Total"
          trendVariant="up"
        />
      </div>

      <div className="main-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Réservations récentes</span>
            <span className="card-action">{reservations.length} au total</span>
          </div>
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Service</th>
                <th>Créneau</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>
                    Aucune réservation pour l&apos;instant.
                  </td>
                </tr>
              ) : (
                recent.map((r) => {
                  const slot = formatSlot(r.slot_date, r.slot_time)
                  return (
                    <tr key={r.id}>
                      <td>
                        <div className="res-name">{r.contact_name}</div>
                        <div className="res-email">{r.contact_email}</div>
                      </td>
                      <td>
                        <ServiceBadge service={r.service} />
                      </td>
                      <td>
                        <div className="res-date">{slot.day}</div>
                        <div className="res-date" style={{ color: '#01EA62' }}>{slot.time}</div>
                      </td>
                      <td>
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="side-stack">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Prochains RV</span>
            </div>
            <div className="upcoming-list">
              {upcoming.length === 0 ? (
                <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)' }}>
                  Aucun RV confirmé à venir.
                </p>
              ) : (
                upcoming.map((r) => {
                  const slot = formatSlot(r.slot_date, r.slot_time)
                  return (
                    <div key={r.id} className="upcoming-item">
                      <div className="upcoming-time">
                        <div className="time">{slot.time}</div>
                        <div className="date">{slot.day}</div>
                      </div>
                      <div className="upcoming-info">
                        <div className="upcoming-name">{r.contact_name}</div>
                        <div className="upcoming-service">
                          {r.service === 'digitalisation' ? 'Digitalisation' : r.service === 'saas' ? 'SaaS Builder' : 'Autre'}
                        </div>
                      </div>
                      <div className={`upcoming-dot ${r.service === 'digitalisation' ? 'digital' : r.service === 'saas' ? 'saas' : ''}`} />
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
