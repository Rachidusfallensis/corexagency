import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import FadeIn from '@/components/ui/FadeIn'
import SectionLabel from '@/components/ui/SectionLabel'
import { OFFERS } from '@/lib/data/offers'

export default function Offers() {
  const t = useTranslations('offers')
  const locale = useLocale()
  const homeHref = `/${locale}`

  return (
    <section id="offres" className="py-24 px-8" style={{ background: '#F4F6F4' }}>
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <header className="mb-14">
            <SectionLabel>{t('label')}</SectionLabel>
            <h2
              className="font-bold text-corex-black mb-3"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {t('title')}
            </h2>
            <p className="text-base max-w-xl" style={{ color: '#6B7280' }}>
              {t('desc')}
            </p>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* CARD DIGITALISATION (light) */}
          <FadeIn className="h-full">
            <article
              className="relative overflow-hidden h-full rounded-[28px] p-10 bg-white transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.09)]"
              style={{ border: '1px solid rgba(0,0,0,0.07)' }}
            >
              {/* Decorative icon — sent to back */}
              <span
                aria-hidden
                className="absolute pointer-events-none rounded-full"
                style={{
                  background: '#016B2D',
                  opacity: 0.12,
                  width: 110,
                  height: 110,
                  right: -15,
                  bottom: -15,
                  zIndex: 0,
                }}
              />

              {/* Content layer */}
              <div className="relative z-[1]">
                <span
                  className="inline-flex items-center px-3.5 py-1 mb-6 rounded-full text-[0.75rem] font-bold uppercase tracking-[0.05em]"
                  style={{ background: 'rgba(1,107,45,0.08)', color: '#016B2D' }}
                >
                  {t('digital.tag')}
                </span>
                <h3
                  className="text-2xl font-semibold text-corex-black mb-3"
                  style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}
                >
                  {t('digital.title')}
                </h3>
                <p className="text-base" style={{ color: '#6B7280', lineHeight: 1.75 }}>
                  {t('digital.desc')}
                </p>
                <div className="flex flex-wrap gap-[7px] my-6">
                  {OFFERS.digitalisation.services.map((s) => (
                    <span
                      key={s}
                      className="px-3.5 py-1.5 rounded-full text-[0.8rem] font-medium text-corex-black"
                      style={{ background: '#F4F6F4' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  href={`${homeHref}#processus`}
                  className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-corex-black transition-[gap] duration-200 hover:gap-3.5"
                >
                  {t('digital.link')} →
                </Link>
              </div>
            </article>
          </FadeIn>

          {/* CARD SAAS BUILDER (dark) */}
          <FadeIn delay={120} className="h-full">
            <article
              className="relative overflow-hidden h-full rounded-[28px] p-10 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
              style={{ background: '#016B2D' }}
            >
              {/* Decorative icon — sent to back */}
              <span
                aria-hidden
                className="absolute pointer-events-none rounded-full"
                style={{
                  background: '#01EA62',
                  opacity: 0.12,
                  width: 110,
                  height: 110,
                  right: -15,
                  bottom: -15,
                  zIndex: 0,
                }}
              />

              {/* Content layer */}
              <div className="relative z-[1]">
                <span
                  className="inline-flex items-center px-3.5 py-1 mb-6 rounded-full text-[0.75rem] font-bold uppercase tracking-[0.05em]"
                  style={{ background: 'rgba(1,234,98,0.2)', color: '#01EA62' }}
                >
                  {t('saas.tag')}
                </span>
                <h3
                  className="text-2xl font-semibold text-white mb-3"
                  style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}
                >
                  {t('saas.title')}
                </h3>
                <p
                  className="text-base"
                  style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.75 }}
                >
                  {t('saas.desc')}
                </p>
                <div className="flex flex-wrap gap-[7px] my-6">
                  {OFFERS.saas.services.map((s) => (
                    <span
                      key={s}
                      className="px-3.5 py-1.5 rounded-full text-[0.8rem] font-medium text-white"
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Link
                  href={`${homeHref}#saas`}
                  className="inline-flex items-center gap-2 text-[0.9rem] font-semibold transition-[gap] duration-200 hover:gap-3.5"
                  style={{ color: '#01EA62' }}
                >
                  {t('saas.link')} →
                </Link>
              </div>
            </article>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
