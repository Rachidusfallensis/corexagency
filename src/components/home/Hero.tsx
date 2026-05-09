import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()

  return (
    <section
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {/* Background décoratif — radial gradient vert */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(1,234,98,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      {/* Background décoratif — dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle, rgba(1,107,45,0.11) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          pointerEvents: 'none',
        }}
      />

      {/* Contenu */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2rem 2rem 2rem',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '5rem',
          alignItems: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Colonne gauche */}
        <div>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(1,107,45,0.08)',
              border: '1px solid rgba(1,107,45,0.2)',
              color: '#016B2D',
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                background: '#01EA62',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }}
            />
            {t('badge')}
          </div>

          {/* Titre */}
          <h1
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
              color: '#050505',
            }}
          >
            {t('title')}
            <br />
            <em style={{ fontStyle: 'normal', color: '#016B2D' }}>
              {t('titleEm')}
            </em>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: '1.1rem',
              color: '#6B7280',
              marginBottom: '2.5rem',
              maxWidth: '460px',
              lineHeight: 1.75,
            }}
          >
            {t('desc')}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link
              href={`/${locale}#offres`}
              style={{
                background: '#050505',
                color: '#fff',
                padding: '0.9rem 2rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {t('ctaPrimary')} →
            </Link>
            <Link
              href={`/${locale}/rendez-vous`}
              style={{
                background: 'transparent',
                color: '#050505',
                padding: '0.9rem 2rem',
                borderRadius: '50px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                border: '1.5px solid #D1D5DB',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* Colonne droite — cards visuelles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Card principale verte */}
          <div
            style={{
              background: '#016B2D',
              borderRadius: '20px',
              padding: '1.75rem',
              animation: 'floatA 6s ease-in-out infinite',
              color: 'white',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                background: 'rgba(1,234,98,0.2)',
                color: '#01EA62',
                padding: '0.25rem 0.8rem',
                borderRadius: '50px',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '0.75rem',
              }}
            >
              Ce qu&apos;on fait
            </div>
            <h3
              style={{
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 700,
                marginBottom: '0.5rem',
              }}
            >
              Deux offres, zéro compromis.
            </h3>
            <p
              style={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
              }}
            >
              Digitalisation d&apos;entreprise ou construction de SaaS — on s&apos;engage à 100% sur votre projet.
            </p>
          </div>

          {/* Row 2 petites cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
            }}
          >
            {/* Card blanche Digitalisation */}
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '1.25rem',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                animation: 'floatA 5s ease-in-out infinite 0.5s',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  color: '#6B7280',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}
              >
                Digitalisation
              </div>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: '#050505',
                  marginBottom: '0.6rem',
                  lineHeight: 1.4,
                }}
              >
                ERP, CRM, e-commerce, automatisations
              </p>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {['ERP', 'CRM', 'SaaS'].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      background:
                        chip === 'ERP' || chip === 'CRM'
                          ? 'rgba(1,234,98,0.15)'
                          : '#F4F6F4',
                      color:
                        chip === 'ERP' || chip === 'CRM' ? '#016B2D' : '#050505',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '50px',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Card noire SaaS */}
            <div
              style={{
                background: '#050505',
                borderRadius: '16px',
                padding: '1.25rem',
                animation: 'floatA 7s ease-in-out infinite 1s',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.5)',
                  fontWeight: 500,
                  marginBottom: '0.5rem',
                }}
              >
                SaaS Builder
              </div>
              <p
                style={{
                  fontSize: '0.78rem',
                  color: 'rgba(255,255,255,0.7)',
                  marginBottom: '0.6rem',
                  lineHeight: 1.4,
                }}
              >
                De l&apos;idée au produit livré
              </p>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {['MVP', 'Design', 'Dev'].map((chip) => (
                  <span
                    key={chip}
                    style={{
                      background: 'rgba(1,234,98,0.12)',
                      color: '#01EA62',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '50px',
                      fontSize: '0.72rem',
                      fontWeight: 500,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
