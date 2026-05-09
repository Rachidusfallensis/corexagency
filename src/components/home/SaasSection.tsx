import { useTranslations } from 'next-intl'
import FadeIn from '@/components/ui/FadeIn'
import SectionLabel from '@/components/ui/SectionLabel'
import { SAAS_STEPS, SAAS_PROGRESS, TECH_BADGES } from '@/lib/data/offers'

export default function SaasSection() {
  const t = useTranslations()

  return (
    <section id="saas" className="py-24 px-8" style={{ background: '#F4F6F4' }}>
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        {/* LEFT */}
        <div>
          <FadeIn>
            <SectionLabel>{t('saas.label')}</SectionLabel>
            <h2
              className="font-bold text-corex-black mb-3"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {t('saas.title')}
            </h2>
            <p className="text-base mb-2" style={{ color: '#6B7280', lineHeight: 1.75 }}>
              {t('saas.desc')}
            </p>
          </FadeIn>

          <div className="mt-8 flex flex-col gap-4">
            {SAAS_STEPS.map((step, i) => (
              <FadeIn key={step.num} delay={i * 100}>
                <div
                  className="flex gap-5 items-start p-5 bg-white rounded-xl"
                  style={{ border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <div className="min-w-[32px] h-8 rounded-full bg-corex-black text-white font-bold text-[0.78rem] flex items-center justify-center">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-[0.95rem] font-semibold text-corex-black mb-0.5">
                      {t(step.titleKey)}
                    </h4>
                    <p className="text-[0.82rem]" style={{ color: '#6B7280', lineHeight: 1.65 }}>
                      {t(step.descKey)}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        {/* RIGHT — saas-visual */}
        <FadeIn delay={200}>
          <div className="rounded-[28px] p-9" style={{ background: '#050505' }}>
            <p
              className="text-[0.7rem] uppercase mb-6"
              style={{
                color: 'rgba(255,255,255,0.35)',
                letterSpacing: '0.1em',
              }}
            >
              Progression MVP — exemple
            </p>

            {SAAS_PROGRESS.map((item) => (
              <div key={item.label} className="mb-4">
                <div className="flex justify-between mb-1.5">
                  <span
                    className="text-[0.78rem]"
                    style={{ color: 'rgba(255,255,255,0.65)' }}
                  >
                    {item.label}
                  </span>
                  <span
                    className="text-[0.78rem] font-semibold"
                    style={{ color: '#01EA62' }}
                  >
                    {item.weeks}
                  </span>
                </div>
                <div
                  className="h-[5px] rounded-[3px] overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="h-full rounded-[3px] transition-[width] duration-1000 ease-out"
                    style={{
                      width: `${item.pct}%`,
                      background: 'linear-gradient(90deg, #016B2D, #01EA62)',
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="flex flex-wrap gap-[7px] mt-6">
              {TECH_BADGES.map((tech) => (
                <span
                  key={tech}
                  className="px-3.5 py-1.5 rounded-full text-[0.75rem] font-medium"
                  style={{
                    background: 'rgba(1,234,98,0.1)',
                    color: '#01EA62',
                    border: '1px solid rgba(1,234,98,0.18)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
