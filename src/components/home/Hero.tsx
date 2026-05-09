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

      <div className="relative z-[1] max-w-[1200px] mx-auto w-full px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
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

        {/* RIGHT — hero-visual (desktop only) */}
        <div className="hidden md:flex justify-center">
          <div className="relative w-[380px] h-[400px] shrink-0">
            {/* CARD 1 — green, top-right */}
            <div
              className="absolute top-0 right-0 w-[280px] rounded-2xl p-6"
              style={{
                background: '#016B2D',
                animation: 'floatA 5s ease-in-out infinite',
                transform: 'rotate(3deg)',
              }}
            >
              <span
                className="inline-block px-3 py-1 mb-3 rounded-full text-[0.7rem] font-bold uppercase tracking-[0.06em]"
                style={{
                  background: 'rgba(1,234,98,0.2)',
                  color: '#01EA62',
                }}
              >
                Ce qu&apos;on fait
              </span>
              <h3 className="text-white text-lg font-semibold mb-2 leading-tight">
                Deux offres, zéro compromis.
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Digitalisation d&apos;entreprise ou construction de SaaS — on s&apos;engage à 100%.
              </p>
            </div>

            {/* CARD 2 — white, bottom-left */}
            <div
              className="absolute bottom-0 left-0 w-[300px] rounded-2xl p-5 bg-white"
              style={{
                boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                animation: 'floatB 6s ease-in-out infinite 0.5s',
                transform: 'rotate(-2deg)',
              }}
            >
              <span className="block mb-3 text-[0.7rem] font-bold uppercase tracking-[0.06em] text-gray-mid">
                Services disponibles
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span
                  className="px-2.5 py-1 rounded-full text-[0.72rem] font-semibold"
                  style={{ background: 'rgba(1,234,98,0.15)', color: '#016B2D' }}
                >
                  ERP
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[0.72rem] font-semibold"
                  style={{ background: 'rgba(1,234,98,0.15)', color: '#016B2D' }}
                >
                  CRM
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[0.72rem] font-semibold text-corex-black"
                  style={{ background: '#F4F6F4' }}
                >
                  E-commerce
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[0.72rem] font-semibold text-corex-black"
                  style={{ background: '#F4F6F4' }}
                >
                  SaaS
                </span>
                <span
                  className="px-2.5 py-1 rounded-full text-[0.72rem] font-semibold text-corex-black"
                  style={{ background: '#F4F6F4' }}
                >
                  Automation
                </span>
              </div>
            </div>

            {/* CARD 3 — black, center */}
            <div
              className="absolute top-1/2 left-1/2 w-[200px] rounded-2xl p-4"
              style={{
                background: '#050505',
                transform: 'translate(-50%, -50%) rotate(1deg)',
              }}
            >
              <div className="flex gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff5f57' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ffbd2e' }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#28ca41' }} />
              </div>
              <pre
                className="text-[0.72rem] leading-[1.6] font-mono"
                style={{ color: '#01EA62' }}
              >
{`✓ ERP déployé
✓ CRM intégré
✓ SaaS en production`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
