import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos — Corex | Your tech partner, from day one',
  description:
    'Corex digitalise les entreprises et construit des produits SaaS. Votre partenaire tech de bout en bout.',
}

const VALUES = [
  {
    title: 'Honnêteté',
    desc: "On dit ce qu'on fait et on fait ce qu'on dit.",
  },
  {
    title: 'Excellence',
    desc: 'Chaque ligne de code, chaque design, chaque décision est faite avec soin.',
  },
  {
    title: 'Impact',
    desc: 'On mesure notre succès à celui de nos clients.',
  },
]

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const home = `/${locale}`

  return (
    <>
      {/* Hero */}
      <section
        style={{
          background: '#050505',
          padding: '8rem 0 6rem',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(1,234,98,0.15)',
              color: '#01EA62',
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '1.5rem',
            }}
          >
            À propos
          </span>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fff',
              marginBottom: '1.5rem',
            }}
          >
            Your tech partner,
            <br />
            <em style={{ fontStyle: 'normal', color: '#01EA62' }}>
              from day one.
            </em>
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: '1.1rem',
              lineHeight: 1.75,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Corex est une agence tech qui digitalise les entreprises et construit des produits SaaS. On s&apos;engage à 100% sur chaque projet.
          </p>
        </div>
      </section>

      {/* Notre mission */}
      <section style={{ background: '#fff', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '4rem',
              alignItems: 'start',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: '#050505',
                  marginBottom: '1.5rem',
                  lineHeight: 1.15,
                }}
              >
                Notre mission
              </h2>
              <p
                style={{
                  color: '#6B7280',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                }}
              >
                Rendre la technologie accessible aux entreprises qui veulent croître et aux entrepreneurs qui veulent innover. On construit des solutions concrètes, pas des promesses.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {VALUES.map((v) => (
                <article
                  key={v.title}
                  style={{
                    background: '#F4F6F4',
                    borderRadius: '16px',
                    padding: '1.5rem',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#016B2D',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {v.title}
                  </h3>
                  <p
                    style={{
                      color: '#6B7280',
                      fontSize: '0.9rem',
                      lineHeight: 1.65,
                    }}
                  >
                    {v.desc}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nos deux offres */}
      <section style={{ background: '#F4F6F4', padding: '5rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#050505',
              marginBottom: '3rem',
              textAlign: 'center',
            }}
          >
            Nos deux offres
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '2rem',
              alignItems: 'stretch',
            }}
          >
            <Link
              href={`${home}/digitalisation`}
              style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '2.5rem',
                border: '1px solid rgba(0,0,0,0.07)',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(1,107,45,0.08)',
                  color: '#016B2D',
                  padding: '0.3rem 0.85rem',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '1.5rem',
                  width: 'fit-content',
                }}
              >
                Digitalisation
              </span>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#050505',
                  marginBottom: '0.75rem',
                  lineHeight: 1.2,
                }}
              >
                Transformez votre entreprise.
              </h3>
              <p
                style={{
                  color: '#6B7280',
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                }}
              >
                ERP, CRM, e-commerce, sites sur mesure, automatisations.
              </p>
              <span
                style={{
                  marginTop: 'auto',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#050505',
                }}
              >
                Voir les services →
              </span>
            </Link>

            <Link
              href={`${home}/saas-builder`}
              style={{
                background: '#016B2D',
                borderRadius: '24px',
                padding: '2.5rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(1,234,98,0.2)',
                  color: '#01EA62',
                  padding: '0.3rem 0.85rem',
                  borderRadius: '50px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginBottom: '1.5rem',
                  width: 'fit-content',
                }}
              >
                SaaS Builder
              </span>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '0.75rem',
                  lineHeight: 1.2,
                }}
              >
                Construisez votre SaaS.
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem',
                  lineHeight: 1.7,
                }}
              >
                De l&apos;idée au MVP en production, avec une équipe dédiée.
              </p>
              <span
                style={{
                  marginTop: 'auto',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#01EA62',
                }}
              >
                Voir le process →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section style={{ background: '#016B2D', padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Travaillons ensemble.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            Réservez un appel découverte de 30 minutes.
          </p>
          <Link
            href={`${home}/rendez-vous`}
            style={{ background: '#01EA62', color: '#050505', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            Prendre un rendez-vous →
          </Link>
        </div>
      </section>
    </>
  )
}
