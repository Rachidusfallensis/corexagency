'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import StatusBadge from '@/components/admin/StatusBadge'
import ServiceBadge from '@/components/admin/ServiceBadge'
import { useToast } from '@/components/admin/Toast'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { getLeads } from '@/lib/admin/actions'
import type { LeadRow } from '@/lib/types/admin'
import Skeleton from '@/components/admin/Skeleton'

const PROFILE_LABELS: Record<string, string> = {
  startup: 'Startup',
  pme: 'PME',
  freelance: 'Freelance',
  other: 'Autre',
}

const SOURCE_LABELS: Record<string, string> = {
  booking: 'Booking',
  queue: "File d'attente",
  contact: 'Contact',
}

const FILTERS: Array<{ value: string; label: string; type: 'service' | 'source' }> = [
  { value: 'all', label: 'Tous', type: 'service' },
  { value: 'digitalisation', label: 'Digitalisation', type: 'service' },
  { value: 'saas', label: 'SaaS Builder', type: 'service' },
  { value: 'booking', label: 'Booking', type: 'source' },
  { value: 'queue', label: "File d'attente", type: 'source' },
]

function csvEscape(v: string | null | undefined): string {
  if (v == null) return ''
  const s = String(v)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

function buildCsv(rows: LeadRow[]): string {
  const header = ['Nom', 'Email', 'Téléphone', 'Entreprise', 'Service', 'Profil', 'Source', 'Statut', 'Date']
  const lines = [header.join(',')]
  for (const r of rows) {
    lines.push(
      [
        csvEscape(r.contact_name),
        csvEscape(r.contact_email),
        csvEscape(r.contact_phone),
        csvEscape(r.contact_company),
        csvEscape(r.service),
        csvEscape(r.profile),
        csvEscape(r.source),
        csvEscape(r.status),
        csvEscape(new Date(r.created_at).toISOString()),
      ].join(',')
    )
  }
  return lines.join('\n')
}

function LeadsInner() {
  const toast = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = 10

  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')

  async function refresh(currentPage: number) {
    setLoading(true)
    try {
      const res = await getLeads({ page: currentPage, limit })
      setLeads(res.data)
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return leads.filter((l) => {
      if (serviceFilter !== 'all' && l.service !== serviceFilter) return false
      if (sourceFilter !== 'all' && l.source !== sourceFilter) return false
      if (q) {
        const hay = `${l.contact_name} ${l.contact_email} ${l.contact_company ?? ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [leads, search, serviceFilter, sourceFilter])

  function exportCsv() {
    const csv = buildCsv(filtered)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `corex-leads-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.show('Export CSV généré', 'success')
  }

  return (
    <>
      <div className="leads-filters">
        <div className="search-wrap">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un lead..."
          />
        </div>
        {FILTERS.map((f) => {
          const active =
            (f.type === 'service' && serviceFilter === f.value) ||
            (f.type === 'source' && sourceFilter === f.value)
          return (
            <button
              key={`${f.type}-${f.value}`}
              type="button"
              className={`filter-btn${active ? ' active' : ''}`}
              onClick={() =>
                f.type === 'service' ? setServiceFilter(f.value) : setSourceFilter(f.value)
              }
            >
              {f.label}
            </button>
          )
        })}
        <button type="button" className="export-btn" onClick={exportCsv}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter CSV
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .leads-table-wrap { display: none !important; }
          .leads-mobile-cards { display: flex !important; }
        }
        .leads-mobile-cards { display: none; flex-direction: column; gap: 0.75rem; }
      `}</style>

      <div className="leads-mobile-cards">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skel-m-${i}`} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem' }}>
              <Skeleton width="60%" height="20px" style={{ marginBottom: '8px' }} />
              <Skeleton width="40%" height="14px" style={{ marginBottom: '16px' }} />
              <Skeleton width="100%" height="40px" />
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.4)' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '1rem' }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <div>Aucun lead trouvé.</div>
          </div>
        ) : (
          filtered.map((l) => (
            <div key={`m-${l.id}`} style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem' }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#fff' }}>{l.contact_name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{l.contact_email}</div>
                </div>
                <StatusBadge status={l.status} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)' }}>Service</div>
                  <ServiceBadge service={l.service} />
                </div>
                <div>
                  <div style={{ color: 'rgba(255,255,255,0.4)' }}>Source</div>
                  <div style={{ color: '#fff' }}>{SOURCE_LABELS[l.source] ?? l.source}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ color: 'rgba(255,255,255,0.4)' }}>Date</div>
                  <div style={{ color: '#fff' }}>
                    {new Date(l.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="leads-table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Contact</th>
                <th>Service</th>
                <th>Profil</th>
                <th>Source</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    <td><Skeleton width="120px" height="18px" /><Skeleton width="150px" height="14px" style={{ marginTop: '4px' }} /></td>
                    <td><Skeleton width="100px" height="24px" borderRadius="12px" /></td>
                    <td><Skeleton width="80px" height="14px" /></td>
                    <td><Skeleton width="80px" height="14px" /></td>
                    <td><Skeleton width="90px" height="24px" borderRadius="12px" /></td>
                    <td><Skeleton width="90px" height="18px" /></td>
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(255,255,255,0.4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <div>Aucun lead trouvé.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <div className="res-name">{l.contact_name}</div>
                      <div className="res-email">{l.contact_email}</div>
                    </td>
                    <td><ServiceBadge service={l.service} /></td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        {PROFILE_LABELS[l.profile] ?? l.profile}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                        {SOURCE_LABELS[l.source] ?? l.source}
                      </span>
                    </td>
                    <td><StatusBadge status={l.status} /></td>
                    <td>
                      <div className="res-date">
                        {new Date(l.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {Math.ceil(total / limit) > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem', padding: '1rem 0' }}>
          <button
            className="action-btn view"
            disabled={page <= 1}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.set('page', (page - 1).toString())
              router.push(`${pathname}?${params.toString()}`)
            }}
          >
            Précédent
          </button>
          <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
            Page {page} / {Math.ceil(total / limit)}
          </span>
          <button
            className="action-btn view"
            disabled={page >= Math.ceil(total / limit)}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.set('page', (page + 1).toString())
              router.push(`${pathname}?${params.toString()}`)
            }}
          >
            Suivant
          </button>
        </div>
      )}
    </>
  )
}

export default function LeadsPage() {
  return (
    <AdminShell title="Leads" subtitle="Tous les contacts entrants">
      <LeadsInner />
    </AdminShell>
  )
}
