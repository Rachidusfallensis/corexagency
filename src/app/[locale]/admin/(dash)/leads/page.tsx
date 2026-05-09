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
  const header = [
    'Nom',
    'Email',
    'Téléphone',
    'Entreprise',
    'Service',
    'Profil',
    'Source',
    'Statut',
    'Date',
  ]
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
      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <div className="relative">
          <svg
            width={13}
            height={13}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-40"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un lead..."
            className="rounded-lg pl-8 pr-3 py-2 text-[0.82rem] text-white outline-none w-[220px]"
            style={{
              background: '#111111',
              border: '1px solid rgba(255,255,255,0.07)',
              fontFamily: 'inherit',
            }}
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
              onClick={() =>
                f.type === 'service'
                  ? setServiceFilter(f.value)
                  : setSourceFilter(f.value)
              }
              className="px-3 py-1.5 rounded-full text-[0.72rem] font-semibold"
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
        <button
          type="button"
          onClick={exportCsv}
          className="ml-auto px-3.5 py-2 rounded-lg text-[0.78rem] font-semibold flex items-center gap-1.5"
          style={{
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Exporter CSV
        </button>
      </div>

      <div
        className="rounded-[18px] overflow-hidden"
        style={{
          background: '#111111',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Contact', 'Service', 'Profil', 'Source', 'Statut', 'Date'].map((h) => (
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
                    colSpan={6}
                    className="px-5 py-8 text-center text-[0.85rem]"
                    style={{ color: 'rgba(255,255,255,0.3)' }}
                  >
                    Aucun lead.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr
                    key={l.id}
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                  >
                    <td className="px-5 py-3.5">
                      <div className="text-[0.85rem] font-semibold">{l.contact_name}</div>
                      <div
                        className="text-[0.72rem]"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        {l.contact_email}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <ServiceBadge service={l.service} />
                    </td>
                    <td
                      className="px-5 py-3.5 text-[0.75rem]"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {PROFILE_LABELS[l.profile] ?? l.profile}
                    </td>
                    <td
                      className="px-5 py-3.5 text-[0.75rem]"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {SOURCE_LABELS[l.source] ?? l.source}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={l.status} />
                    </td>
                    <td
                      className="px-5 py-3.5 text-[0.8rem] whitespace-nowrap"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {new Date(l.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
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
