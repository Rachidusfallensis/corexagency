import { useTranslations } from 'next-intl'

export default function Offers() {
  const t = useTranslations('offers')

  const digitalServices = [
    'ERP',
    'CRM',
    'E-commerce',
    'Site sur mesure',
    'Automatisation',
    'Intégrations API',
  ]
  const saasServices = [
    'Product Design',
    'MVP rapide',
    'Architecture',
    'Développement',
    'Lancement',
    'Itération',
  ]

  return (
    <section id="offres" style={{ background: '#F4F6F4', padding: '6rem 0' }}>
      <div
        style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '3.5rem' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.78rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#016B2D',
              marginBottom: '0.75rem',
            }}
          >
            {t('label')}
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem,4vw,3rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              marginBottom: '0.75rem',
              color: '#050505',
              lineHeight: 1.15,
            }}
          >
            {t('title')}
          </h2>
          <p style={{ color: '#6B7280', maxWidth: '600px', lineHeight: 1.75 }}>
            {t('desc')}
          </p>
        </div>

        {/* Grid 2 cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '2rem',
            alignItems: 'stretch',
          }}
        >
          {/* Card Digitalisation */}
          <div
            style={{
              background: '#fff',
              borderRadius: '28px',
              padding: '2.5rem',
              border: '1px solid rgba(0,0,0,0.07)',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Décor en arrière */}
            <div
              style={{
                position: 'absolute',
                right: '-15px',
                bottom: '-15px',
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: '#016B2D',
                opacity: 0.08,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />
            {/* Contenu au-dessus */}
            <div style={{ position: 'relative', zIndex: 1 }}>
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
                }}
              >
                {t('digital.tag')}
              </span>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  color: '#050505',
                  lineHeight: 1.2,
                }}
              >
                {t('digital.title')}
              </h3>
              <p style={{ color: '#6B7280', marginBottom: '1.5rem', lineHeight: 1.75 }}>
                {t('digital.desc')}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '7px',
                  marginBottom: '2rem',
                }}
              >
                {digitalServices.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      background: '#F4F6F4',
                      color: '#050505',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <a
                href="#processus"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#050505',
                  textDecoration: 'none',
                }}
              >
                {t('digital.link')} →
              </a>
            </div>
          </div>

          {/* Card SaaS Builder */}
          <div
            style={{
              background: '#016B2D',
              borderRadius: '28px',
              padding: '2.5rem',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Décor en arrière */}
            <div
              style={{
                position: 'absolute',
                right: '-15px',
                bottom: '-15px',
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                background: '#01EA62',
                opacity: 0.1,
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />
            {/* Contenu au-dessus */}
            <div style={{ position: 'relative', zIndex: 1 }}>
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
                }}
              >
                {t('saas.tag')}
              </span>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 600,
                  marginBottom: '0.75rem',
                  color: '#fff',
                  lineHeight: 1.2,
                }}
              >
                {t('saas.title')}
              </h3>
              <p
                style={{
                  color: 'rgba(255,255,255,0.65)',
                  marginBottom: '1.5rem',
                  lineHeight: 1.75,
                }}
              >
                {t('saas.desc')}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '7px',
                  marginBottom: '2rem',
                }}
              >
                {saasServices.map((s) => (
                  <span
                    key={s}
                    style={{
                      padding: '0.35rem 0.85rem',
                      borderRadius: '50px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      background: 'rgba(255,255,255,0.1)',
                      color: '#fff',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <a
                href="#saas"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#01EA62',
                  textDecoration: 'none',
                }}
              >
                {t('saas.link')} →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
