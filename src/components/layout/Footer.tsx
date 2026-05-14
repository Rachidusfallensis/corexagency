import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { LOGOS, LOGO_SIZES } from '@/lib/assets'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  const homeHref = `/${locale}`
  const linkClass =
    'text-sm text-white/45 hover:text-green-vivid transition-colors block mb-2.5'

  return (
    <footer className="bg-corex-black border-t border-white/[0.06] pt-16 pb-8 px-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <Link href={homeHref} className="inline-flex items-center mb-4">
              <Image
                src={LOGOS.blanc}
                alt="Corex"
                width={LOGO_SIZES.footer.width}
                height={LOGO_SIZES.footer.height}
              />
            </Link>
            <p className="text-sm text-white/45 max-w-[240px] mt-2">
              {t('tagline')}
            </p>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.08em] text-white mb-5">
              {t('col1Title')}
            </h5>
            <Link href={`${homeHref}/digitalisation`} className={linkClass}>
              {t('digitalisation')}
            </Link>
            <Link href={`${homeHref}/projets`} className={linkClass}>
              {t('projects')}
            </Link>
            <Link href={`${homeHref}/saas-builder`} className={linkClass}>
              {t('saasBuilder')}
            </Link>
            <a href={`${homeHref}#processus`} className={linkClass}>
              {t('process')}
            </a>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.08em] text-white mb-5">
              {t('col2Title')}
            </h5>
            <Link href={`${homeHref}/a-propos`} className={linkClass}>
              {t('about')}
            </Link>
            <a href={`${homeHref}#contact`} className={linkClass}>
              {t('contact')}
            </a>
          </div>

          <div>
            <h5 className="text-xs font-bold uppercase tracking-[0.08em] text-white mb-5">
              {t('col3Title')}
            </h5>
            <a href={`mailto:${t('email')}`} className={linkClass}>
              {t('email')}
            </a>
            <Link href={`${homeHref}/rendez-vous`} className={linkClass}>
              {t('bookingLink')}
            </Link>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-white/30">{t('copyright')}</p>
          <p
            className="text-xs text-white/30"
            dangerouslySetInnerHTML={{
              __html: t('madeWith').replace(
                '♥',
                '<span style="color:#01EA62">♥</span>'
              ),
            }}
          />
        </div>
      </div>
    </footer>
  )
}
