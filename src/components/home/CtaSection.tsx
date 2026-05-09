import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

export default function CtaSection() {
  const t = useTranslations('cta')
  const locale = useLocale()
  const bookingHref = `/${locale}/rendez-vous`

  return (
    <section
      id="contact"
      className="relative overflow-hidden text-center py-28 px-8"
      style={{ background: '#016B2D' }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 50% 120%, rgba(1,234,98,0.15), transparent 70%)',
        }}
      />

      <div className="relative z-[1] max-w-[1200px] mx-auto">
        <h2
          className="text-white font-bold mb-4"
          style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {t('title')}
        </h2>
        <p
          className="max-w-[480px] mx-auto mb-10"
          style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.75 }}
        >
          {t('desc')}
        </p>
        <Link
          href={bookingHref}
          className="inline-flex items-center gap-2.5 rounded-full px-10 py-4 text-base font-bold text-corex-black transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(1,234,98,0.3)]"
          style={{ background: '#01EA62' }}
        >
          {t('btn')} →
        </Link>
      </div>
    </section>
  )
}
