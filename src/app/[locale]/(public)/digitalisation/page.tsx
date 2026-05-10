import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Digitalisation entreprise — ERP, CRM, E-commerce | Corex',
  description:
    'Transformez votre entreprise avec les bons outils digitaux. ERP, CRM, e-commerce, automatisations sur mesure.',
}

const SERVICES = [
  {
    title: 'ERP — Gestion d’entreprise',
    desc: "Centralisez vos opérations : stocks, achats, ventes, comptabilité dans un seul système adapté à votre activité.",
    icon: 'grid',
  },
  {
    title: 'CRM — Relation client',
    desc: "Gérez vos prospects, clients et opportunités. Automatisez vos relances et ne ratez plus aucune opportunité.",
    icon: 'users',
  },
  {
    title: 'E-commerce',
    desc: "Lancez ou optimisez votre boutique en ligne. Synchronisez stocks, commandes et paiements en temps réel.",
    icon: 'shopping-bag',
  },
  {
    title: 'Site sur mesure',
    desc: "Un site web qui reflète votre marque et convertit vos visiteurs en clients. Design unique, performance optimale.",
    icon: 'monitor',
  },
  {
    title: 'Automatisation',
    desc: "Éliminez les tâches répétitives. Connectez vos outils et automatisez vos workflows pour gagner du temps.",
    icon: 'zap',
  },
  {
    title: 'Intégrations API',
    desc: "Connectez tous vos outils existants. Salesforce, HubSpot, Stripe, Shopify et plus — tout dans un écosystème unifié.",
    icon: 'link',
  },
]

function Icon({ name }: { name: string }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#016B2D',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'grid':
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
      )
    case 'users':
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      )
    case 'shopping-bag':
      return (
        <svg {...props}>
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      )
    case 'monitor':
      return (
        <svg {...props}>
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    case 'zap':
      return (
        <svg {...props}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      )
    case 'link':
      return (
        <svg {...props}>
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      )
    default:
      return null
  }
}

export default async function DigitalisationPage({
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
            Digitalisation
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
            Transformez votre entreprise
            <br />
            avec les bons outils.
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
            ERP, CRM, e-commerce, sites sur mesure, automatisations — on construit les fondations digitales de votre croissance.
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
            Prendre un rendez-vous →
          </Link>
        </div>
      </section>

      {/* Services détaillés */}
      <section style={{ background: '#fff', padding: '5rem 0' }}>
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
            Nos services
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
            }}
          >
            {SERVICES.map((s) => (
              <article
                key={s.title}
                style={{
                  background: '#F4F6F4',
                  borderRadius: '16px',
                  padding: '1.75rem',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: 'rgba(1,107,45,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Icon name={s.icon} />
                </div>
                <h3
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#050505',
                    marginBottom: '0.5rem',
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: '#6B7280',
                    fontSize: '0.9rem',
                    lineHeight: 1.65,
                  }}
                >
                  {s.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: '#016B2D', padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Prêt à digitaliser votre activité&nbsp;?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '480px', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            30 minutes pour comprendre votre situation et voir comment on peut vous aider.
          </p>
          <Link
            href={bookingHref}
            style={{ background: '#01EA62', color: '#050505', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}
          >
            Prendre un rendez-vous →
          </Link>
        </div>
      </section>
    </>
  )
}
