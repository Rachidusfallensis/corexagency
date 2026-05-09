import { useTranslations } from 'next-intl'
import FadeIn from '@/components/ui/FadeIn'
import SectionLabel from '@/components/ui/SectionLabel'
import ExampleCard from '@/components/ui/ExampleCard'
import { EXAMPLES_SAAS } from '@/lib/data/offers'

export default function ExamplesSaas() {
  const t = useTranslations('examplesSaas')

  return (
    <section id="exemples-saas" className="py-20 px-8" style={{ background: '#050505' }}>
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <header className="mb-12">
            <SectionLabel color="green-vivid">{t('label')}</SectionLabel>
            <h2
              className="font-bold text-white mb-3"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {t('title')}
            </h2>
            <p className="text-base max-w-xl" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {t('desc')}
            </p>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXAMPLES_SAAS.map((ex, i) => (
            <FadeIn key={ex.sector} delay={i * 100}>
              <ExampleCard
                sector={ex.sector}
                title={ex.title}
                desc={ex.desc}
                result={ex.result}
                dark
              />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
