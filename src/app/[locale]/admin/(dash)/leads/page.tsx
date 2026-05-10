'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import StatusBadge from '@/components/admin/StatusBadge'
import ServiceBadge from '@/components/admin/ServiceBadge'
import { useToast } from '@/components/admin/Toast'
import { getLeads } from '@/lib/admin/actions'
import type { LeadRow } from '@/lib/types/admin'

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
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [search, setSearch] = useState('')
  const [serviceFilter, setServiceFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')

  useEffect(() => {
    getLeads().then(setLeads)
  }, [])

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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>
                    Aucun lead.
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
