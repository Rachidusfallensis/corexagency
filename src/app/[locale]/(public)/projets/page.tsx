import Link from 'next/link'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getPublishedProjects } from '@/lib/data/projects'
import {
  EXAMPLES_DIGITAL_FR,
  EXAMPLES_DIGITAL_EN,
  EXAMPLES_SAAS_FR,
  EXAMPLES_SAAS_EN,
} from '@/lib/data/offers'
import ProjectsFilterClient from './ProjectsFilterClient'

export const metadata: Metadata = {
  title: 'Projets et réalisations | Corex',
  description:
    'Découvrez nos projets livrés et des exemples concrets de ce que nous pouvons construire pour votre secteur.',
}

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function ProjectsPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'projects' })

  const projects = await getPublishedProjects()
  const examplesDigital = locale === 'en' ? EXAMPLES_DIGITAL_EN : EXAMPLES_DIGITAL_FR
  const examplesSaas = locale === 'en' ? EXAMPLES_SAAS_EN : EXAMPLES_SAAS_FR

  const mapped = projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    category: p.category,
    sector: p.sector,
    title: locale === 'en' ? p.title_en : p.title_fr,
    summary: locale === 'en' ? p.summary_en : p.summary_fr,
    result: (locale === 'en' ? p.result_en : p.result_fr) ?? null,
    cover: p.cover_image,
    tech_stack: p.tech_stack ?? [],
  }))

  return (
    <div
      style={{
        background: '#fff',
        color: '#050505',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        paddingTop: '5rem',
      }}
    >
      {/* HERO */}
      <section
        style={{
          padding: '5rem 0 4rem',
          background: '#050505',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse 70% 60% at 80% 30%,rgba(1,234,98,0.10) 0%,transparent 70%)',
          }}
        />
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 2rem',
            position: 'relative',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#01EA62',
              marginBottom: '0.75rem',
            }}
          >
            {t('heroLabel')}
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.2rem,4.5vw,3.6rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '1rem',
              maxWidth: 720,
            }}
          >
            {t('heroTitle')}
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: '1.1rem',
              lineHeight: 1.7,
              maxWidth: 620,
            }}
          >
            {t('heroDesc')}
          </p>
        </div>
      </section>

      {/* PROJETS RÉELS (avec filtre client) */}
      <section style={{ padding: '5rem 0 3rem', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2
              style={{
                fontSize: 'clamp(1.8rem,3vw,2.4rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem',
              }}
            >
              {t('realizedTitle')}
            </h2>
            <p style={{ color: '#6B7280', fontSize: '1rem', maxWidth: 620 }}>
              {t('realizedDesc')}
            </p>
          </div>

          {mapped.length === 0 ? (
            <div
              style={{
                padding: '3rem',
                background: '#F4F6F4',
                borderRadius: 16,
                textAlign: 'center',
                color: '#6B7280',
              }}
            >
              {t('empty')}
            </div>
          ) : (
            <ProjectsFilterClient
              locale={locale}
              projects={mapped}
              labels={{
                all: t('filterAll'),
                digital: t('filterDigital'),
                saas: t('filterSaas'),
                view: t('viewProject'),
              }}
            />
          )}
        </div>
      </section>

      {/* EXEMPLES SECTORIELS */}
      <section style={{ padding: '5rem 0 5rem', background: '#050505', color: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem' }}>
          {/* Séparateur visuel */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  'linear-gradient(90deg, transparent 0%, rgba(1,234,98,0.4) 100%)',
              }}
            />
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: '#01EA62',
                whiteSpace: 'nowrap',
              }}
            >
              ◆ Exemples
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background:
                  'linear-gradient(90deg, rgba(1,234,98,0.4) 0%, transparent 100%)',
              }}
            />
          </div>

          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h2
              style={{
                fontSize: 'clamp(1.8rem,3vw,2.4rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '0.75rem',
                color: '#fff',
              }}
            >
              {t('examplesTitle')}
            </h2>
            <p
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '1rem',
                maxWidth: 620,
                margin: '0 auto',
                lineHeight: 1.65,
              }}
            >
              {t('examplesDesc')}
            </p>
          </div>

          <h3
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#01EA62',
              marginBottom: '1.25rem',
            }}
          >
            {t('filterDigital')}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              marginBottom: '3rem',
            }}
          >
            {examplesDigital.map((ex) => (
              <article
                key={ex.sector + ex.title}
                style={{
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '1.5rem',
                  color: '#fff',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 50,
                    background: 'rgba(1,234,98,0.1)',
                    color: '#01EA62',
                    marginBottom: '1rem',
                  }}
                >
                  {ex.sector}
                </span>
                <h4
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#fff',
                  }}
                >
                  {ex.title}
                </h4>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.65,
                  }}
                >
                  {ex.desc}
                </p>
                <div
                  style={{
                    marginTop: '0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#01EA62',
                  }}
                >
                  → {ex.result}
                </div>
              </article>
            ))}
          </div>

          <h3
            style={{
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#01EA62',
              marginBottom: '1.25rem',
            }}
          >
            {t('filterSaas')}
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {examplesSaas.map((ex) => (
              <article
                key={ex.sector + ex.title}
                style={{
                  background: '#111',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 16,
                  padding: '1.5rem',
                  color: '#fff',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.25rem 0.75rem',
                    borderRadius: 50,
                    background: 'rgba(1,234,98,0.1)',
                    color: '#01EA62',
                    marginBottom: '1rem',
                  }}
                >
                  {ex.sector}
                </span>
                <h4
                  style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem',
                    color: '#fff',
                  }}
                >
                  {ex.title}
                </h4>
                <p
                  style={{
                    fontSize: '0.82rem',
                    color: 'rgba(255,255,255,0.6)',
                    lineHeight: 1.65,
                  }}
                >
                  {ex.desc}
                </p>
                <div
                  style={{
                    marginTop: '0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: '#01EA62',
                  }}
                >
                  → {ex.result}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: '5rem 0',
          background: '#016B2D',
          color: '#fff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 60% 80% at 50% 120%,rgba(1,234,98,0.15),transparent 70%)',
          }}
        />
        <div
          style={{
            maxWidth: 720,
            margin: '0 auto',
            padding: '0 2rem',
            position: 'relative',
          }}
        >
          <h2
            style={{
              fontSize: 'clamp(1.8rem,3.5vw,2.6rem)',
              fontWeight: 700,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
            }}
          >
            Votre projet est le prochain ?
          </h2>
          <p
            style={{
              color: 'rgba(255,255,255,0.7)',
              marginBottom: '2rem',
              fontSize: '1.05rem',
            }}
          >
            On en discute en 30 minutes, sans engagement.
          </p>
          <Link
            href={`/${locale}/rendez-vous`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#01EA62',
              color: '#050505',
              padding: '1rem 2.5rem',
              borderRadius: 50,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: '1rem',
            }}
          >
            Prendre un rendez-vous →
          </Link>
        </div>
      </section>
    </div>
  )
}
