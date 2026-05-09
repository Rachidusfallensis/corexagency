import { useTranslations } from 'next-intl'
import FadeIn from '@/components/ui/FadeIn'
import SectionLabel from '@/components/ui/SectionLabel'
import { WHY_ITEMS, type WhyIcon } from '@/lib/data/offers'

function Icon({ name }: { name: WhyIcon }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: '#01EA62',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  switch (name) {
    case 'lightning':
      return (
        <svg {...common}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
      )
    case 'users':
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
        </svg>
      )
    case 'code':
      return (
        <svg {...common}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      )
    case 'support':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      )
  }
}

export default function WhyCorex() {
  const t = useTranslations()

  return (
    <section className="py-24 px-8" style={{ background: '#050505' }}>
      <div className="max-w-[1200px] mx-auto">
        <FadeIn>
          <header className="mb-12">
            <SectionLabel color="green-vivid">{t('why.label')}</SectionLabel>
            <h2
              className="font-bold text-white"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
              }}
            >
              {t('why.title')}
            </h2>
          </header>
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {WHY_ITEMS.map((item, i) => (
            <FadeIn key={item.icon} delay={i * 100}>
              <article
                className="p-8 rounded-[20px] transition-all duration-200"
                style={{
                  border: '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(255,255,255,0.02)',
                }}
              >
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-5"
                  style={{ background: 'rgba(1,234,98,0.1)' }}
                >
                  <Icon name={item.icon} />
                </div>
                <h4 className="text-white font-semibold mb-1">
                  {t(item.titleKey)}
                </h4>
                <p
                  className="text-[0.875rem]"
                  style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}
                >
                  {t(item.descKey)}
                </p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
