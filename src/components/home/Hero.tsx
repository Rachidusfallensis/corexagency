import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function Hero() {
  const t = useTranslations('hero')
  const locale = useLocale()
  const homeHref = `/${locale}`
  const bookingHref = `/${locale}/rendez-vous`

  return (
    <section
      className="relative min-h-screen overflow-hidden flex items-center pt-20"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage:
          'radial-gradient(ellipse 70% 60% at 80% 50%, rgba(1,234,98,0.07) 0%, transparent 70%)',
      }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(1,107,45,0.11) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="relative z-[1] max-w-[1200px] mx-auto w-full px-8 grid grid-cols-1 md:grid-cols-2 md:gap-20 gap-12 items-center">
        {/* LEFT */}
        <div>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-[0.06em]"
            style={{
              background: 'rgba(1,107,45,0.08)',
              border: '1px solid rgba(1,107,45,0.2)',
              color: '#016B2D',
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full bg-green-vivid"
              style={{ animation: 'pulse-dot 2s ease-in-out infinite' }}
            />
            {t('badge')}
          </div>

          <h1
            className="font-extrabold leading-[1.15] mb-5 text-corex-black"
            style={{
              fontSize: 'clamp(2.8rem, 6vw, 5.2rem)',
              letterSpacing: '-0.03em',
            }}
          >
            {t('title')}
            <br />
            <em className="not-italic" style={{ color: '#016B2D' }}>
              {t('titleEm')}
            </em>
          </h1>

          <p
            className="text-[1.1rem] leading-[1.75] max-w-[460px] mb-10"
            style={{ color: '#6B7280' }}
          >
            {t('desc')}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href={`${homeHref}#offres`}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[0.95rem] font-semibold text-white bg-corex-black transition-all duration-200 hover:bg-green-deep hover:-translate-y-0.5"
            >
              {t('ctaPrimary')} →
            </Link>
            <Link
              href={bookingHref}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-[0.95rem] font-semibold text-corex-black bg-transparent transition-all duration-200 hover:-translate-y-0.5"
              style={{ border: '1.5px solid #D1D5DB' }}
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>

        {/* RIGHT — hero-visual (desktop only): flex column, main card + 2-card row */}
        <div className="hidden md:flex flex-col gap-4">
          {/* MAIN CARD — green */}
          <div
            className="rounded-[20px] p-7"
            style={{
              background: '#016B2D',
              animation: 'floatA 6s ease-in-out infinite',
            }}
          >
            <span
              className="inline-block px-3 py-1 mb-3 rounded-full text-[0.72rem] font-bold uppercase tracking-[0.06em]"
              style={{ background: 'rgba(1,234,98,0.2)', color: '#01EA62' }}
            >
              Ce qu&apos;on fait
            </span>
            <h3 className="text-white text-[1.2rem] font-semibold mb-2 leading-tight">
              Deux offres, zéro compromis.
            </h3>
            <p
              className="text-[0.9rem] leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              Digitalisation d&apos;entreprise ou construction de SaaS — on s&apos;engage à 100% sur votre projet.
            </p>
          </div>

          {/* ROW — 2 small cards side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* Small card — white "Digitalisation" */}
            <div
              className="rounded-2xl p-5 bg-white"
              style={{
                border: '1px solid rgba(0,0,0,0.08)',
                animation: 'floatA 5s ease-in-out infinite 0.5s',
              }}
            >
              <h4 className="text-[0.85rem] font-semibold text-corex-black mb-1">
                Digitalisation
              </h4>
              <p className="text-[0.8rem] mb-2.5" style={{ color: '#6B7280' }}>
                ERP, CRM, e-commerce, automatisations
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[0.72rem] font-medium"
                  style={{ background: 'rgba(1,234,98,0.15)', color: '#016B2D' }}
                >
                  ERP
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[0.72rem] font-medium"
                  style={{ background: 'rgba(1,234,98,0.15)', color: '#016B2D' }}
                >
                  CRM
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[0.72rem] font-medium text-corex-black"
                  style={{ background: '#F4F6F4' }}
                >
                  SaaS
                </span>
              </div>
            </div>

            {/* Small card — black "SaaS Builder" */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: '#050505',
                animation: 'floatA 7s ease-in-out infinite 1s',
              }}
            >
              <h4 className="text-[0.85rem] font-semibold text-white mb-1">
                SaaS Builder
              </h4>
              <p
                className="text-[0.8rem] mb-2.5"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                De l&apos;idée au produit livré
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['MVP', 'Design', 'Dev'].map((chip) => (
                  <span
                    key={chip}
                    className="px-2.5 py-0.5 rounded-full text-[0.72rem] font-medium"
                    style={{
                      background: 'rgba(1,234,98,0.12)',
                      color: '#01EA62',
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
