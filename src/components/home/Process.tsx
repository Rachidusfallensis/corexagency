import { useTranslations } from 'next-intl'
import FadeIn from '@/components/ui/FadeIn'
import SectionLabel from '@/components/ui/SectionLabel'
import { PROCESS_STEPS } from '@/lib/data/offers'

export default function Process() {
  const t = useTranslations()

  return (
    <section id="processus" className="py-24 px-8 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <header className="mb-12">
            <SectionLabel>{t('process.label')}</SectionLabel>
            <h2
              className="font-bold text-corex-black mb-3"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {t('process.title')}
            </h2>
            <p className="text-base max-w-xl" style={{ color: '#6B7280' }}>
              {t('process.desc')}
            </p>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {PROCESS_STEPS.map((step, i) => (
            <FadeIn key={step.num} delay={i * 100}>
              <article
                className="rounded-2xl p-7 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-green-vivid"
                style={{ border: '1px solid rgba(0,0,0,0.07)' }}
              >
                <div
                  className="w-[38px] h-[38px] rounded-full bg-green-vivid text-corex-black font-extrabold text-[0.85rem] flex items-center justify-center mb-4"
                >
                  {step.num}
                </div>
                <h4 className="text-base font-semibold text-corex-black mb-1">
                  {t(step.titleKey)}
                </h4>
                <p className="text-[0.875rem]" style={{ color: '#6B7280', lineHeight: 1.65 }}>
                  {t(step.descKey)}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
