import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "SaaS Builder — De l'idée au produit | Corex",
  description:
    'Construisez votre SaaS de A à Z avec une équipe tech dédiée. MVP en 8 semaines.',
}

const PROFILES = [
  {
    badge: 'Startup',
    title: 'Fondateurs & Startups',
    desc: 'Vous avez une idée validée et cherchez une équipe tech pour construire votre MVP rapidement.',
  },
  {
    badge: 'Entrepreneur',
    title: 'Entrepreneurs',
    desc: 'Vous avez identifié un problème sur votre marché et voulez lancer un SaaS pour le résoudre.',
  },
  {
    badge: 'PME',
    title: 'PME innovantes',
    desc: "Votre entreprise veut lancer un produit digital en parallèle de son activité principale.",
  },
]

const STEPS = [
  {
    num: '1',
    period: 'Semaine 1-2',
    title: 'Cadrage produit',
    desc: "On définit ensemble le périmètre exact du MVP, les user stories, l'architecture technique et le plan de développement.",
  },
  {
    num: '2',
    period: 'Semaine 2-3',
    title: 'Design & Prototype',
    desc: "Maquettes interactives Figma pour valider l'expérience utilisateur avant d'écrire une seule ligne de code.",
  },
  {
    num: '3',
    period: 'Semaine 3-7',
    title: 'Développement MVP',
    desc: 'Construction itérative avec des demos hebdomadaires. Stack moderne : Next.js, Supabase, TypeScript.',
  },
  {
    num: '4',
    period: 'Semaine 8+',
    title: 'Lancement & Itération',
    desc: 'Mise en production, onboarding des premiers utilisateurs, collecte de feedback et amélioration continue.',
  },
]

const STACK = ['Next.js', 'React', 'TypeScript', 'Supabase', 'Node.js']

export default async function SaasBuilderPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const bookingHref = `/${locale}/rendez-vous`

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
            SaaS Builder
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
            De l&apos;idée au produit.
          </h1>
          <p
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: '1.1rem',
              lineHeight: 1.75,
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
            }}
          >
            Vous avez validé un problème et vous voyez la solution — il vous manque l&apos;équipe tech pour l&apos;exécuter. C&apos;est exactement ce qu&apos;on fait.
          </p>
          <Link
            href={bookingHref}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#01EA62',
              color: '#050505',
              padding: '1rem 2rem',
              borderRadius: '50px',
              fontWeight: 700,
              fontSize: '0.95rem',
              textDecoration: 'none',
            }}
          >
            Démarrer mon projet →
          </Link>
        </div>
      </section>

      {/* Pour qui */}
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
            Pour qui&nbsp;?
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}
          >
            {PROFILES.map((p) => (
              <article
                key={p.title}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  border: '1px solid rgba(0,0,0,0.07)',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    background: 'rgba(1,107,45,0.08)',
                    color: '#016B2D',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '50px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '1rem',
                  }}
                >
                  {p.badge}
                </span>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#050505',
                    marginBottom: '0.5rem',
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    color: '#6B7280',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                  }}
                >
                  {p.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Process SaaS détaillé */}
      <section style={{ background: '#fff', padding: '5rem 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
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
            Notre process SaaS
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  padding: '1.5rem',
                  background: '#F4F6F4',
                  borderRadius: '16px',
                }}
              >
                <div
                  style={{
                    minWidth: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#050505',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {step.num}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: '#016B2D',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {step.period}
                  </div>
                  <h3
                    style={{
                      fontSize: '1.05rem',
                      fontWeight: 600,
                      color: '#050505',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      color: '#6B7280',
                      fontSize: '0.9rem',
                      lineHeight: 1.65,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack technique */}
      <section style={{ background: '#050505', padding: '4rem 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#fff',
              marginBottom: '2rem',
            }}
          >
            Notre stack
          </h2>
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {STACK.map((tech) => (
              <span
                key={tech}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: '50px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  background: 'rgba(1,234,98,0.1)',
                  color: '#01EA62',
                  border: '1px solid rgba(1,234,98,0.25)',
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#016B2D', padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Prêt à lancer votre SaaS&nbsp;?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            30 minutes pour cadrer votre projet et estimer votre MVP.
          </p>
          <Link
            href={bookingHref}
            style={{ background: '#01EA62', color: '#050505', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            Démarrer mon projet →
          </Link>
        </div>
      </section>
    </>
  )
}
