'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useMemo } from 'react'

type ProjectCard = {
  id: string
  slug: string
  category: 'digitalisation' | 'saas'
  sector: string
  title: string
  summary: string
  result: string | null
  cover: string | null
  tech_stack: string[]
}

type Props = {
  locale: string
  projects: ProjectCard[]
  labels: { all: string; digital: string; saas: string; view: string }
}

export default function ProjectsFilterClient({ locale, projects, labels }: Props) {
  const [filter, setFilter] = useState<'all' | 'digitalisation' | 'saas'>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter]
  )

  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.5rem 1.1rem',
    borderRadius: 50,
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    border: '1.5px solid',
    borderColor: active ? '#016B2D' : '#D1D5DB',
    background: active ? 'rgba(1,107,45,0.08)' : 'transparent',
    color: active ? '#016B2D' : '#6B7280',
    fontFamily: 'inherit',
    transition: 'all 0.15s',
  })

  return (
    <>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <button type="button" style={pillStyle(filter === 'all')} onClick={() => setFilter('all')}>
          {labels.all}
        </button>
        <button
          type="button"
          style={pillStyle(filter === 'digitalisation')}
          onClick={() => setFilter('digitalisation')}
        >
          {labels.digital}
        </button>
        <button
          type="button"
          style={pillStyle(filter === 'saas')}
          onClick={() => setFilter('saas')}
        >
          {labels.saas}
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/${locale}/projets/${p.slug}`}
            style={{
              display: 'block',
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.07)',
              borderRadius: 20,
              overflow: 'hidden',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)'
              e.currentTarget.style.boxShadow = '0 14px 35px rgba(0,0,0,0.08)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = ''
            }}
          >
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 10',
                background:
                  p.category === 'saas'
                    ? 'linear-gradient(135deg, #050505 0%, #016B2D 100%)'
                    : 'linear-gradient(135deg, #F4F6F4 0%, #D1D5DB 100%)',
              }}
            >
              {p.cover ? (
                <Image
                  src={p.cover}
                  alt={p.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : null}
              <span
                style={{
                  position: 'absolute',
                  top: '0.85rem',
                  left: '0.85rem',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  padding: '0.25rem 0.7rem',
                  borderRadius: 50,
                  background: p.category === 'saas' ? 'rgba(1,234,98,0.18)' : 'rgba(1,107,45,0.12)',
                  color: p.category === 'saas' ? '#01EA62' : '#016B2D',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {p.category === 'saas' ? labels.saas : labels.digital}
              </span>
            </div>

            <div style={{ padding: '1.25rem 1.4rem 1.5rem' }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#6B7280',
                  marginBottom: '0.5rem',
                }}
              >
                {p.sector}
              </span>
              <h3
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  marginBottom: '0.5rem',
                  lineHeight: 1.3,
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: '#6B7280',
                  lineHeight: 1.6,
                  marginBottom: '0.85rem',
                }}
              >
                {p.summary}
              </p>
              {p.result && (
                <div
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#016B2D',
                    marginBottom: '0.85rem',
                  }}
                >
                  → {p.result}
                </div>
              )}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  color: '#050505',
                }}
              >
                {labels.view} →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
