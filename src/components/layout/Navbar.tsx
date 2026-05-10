'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { LOGOS, LOGO_SIZES } from '@/lib/assets'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const otherLocale = locale === 'fr' ? 'en' : 'fr'
  const switchHref =
    pathname?.replace(/^\/(fr|en)(?=\/|$)/, `/${otherLocale}`) ?? `/${otherLocale}`

  const homeHref = `/${locale}`
  const bookingHref = `/${locale}/rendez-vous`

  // On the homepage, use bare hash so smooth-scroll works in-page.
  // Elsewhere, use absolute path so clicking goes home then scrolls.
  const isHome = pathname === homeHref || pathname === `${homeHref}/`
  const anchor = (id: string) => (isHome ? `#${id}` : `${homeHref}#${id}`)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] h-16 px-8 border-b border-black/[0.07] backdrop-blur-[20px] transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_2px_24px_rgba(0,0,0,0.07)]' : ''
      }`}
      style={{ background: 'rgba(255,255,255,0.93)' }}
    >
      <div className="max-w-[1200px] mx-auto h-full flex items-center justify-between">
        <Link href={homeHref} className="flex items-center gap-2.5">
          <Image
            src={LOGOS.color}
            alt="Corex"
            width={LOGO_SIZES.nav.width}
            height={LOGO_SIZES.nav.height}
            priority
          />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a
            href={anchor('offres')}
            className="text-sm font-medium text-gray-mid hover:text-corex-black transition-colors"
          >
            {t('offers')}
          </a>
          <a
            href={anchor('processus')}
            className="text-sm font-medium text-gray-mid hover:text-corex-black transition-colors"
          >
            {t('howItWorks')}
          </a>
          <a
            href={anchor('saas')}
            className="text-sm font-medium text-gray-mid hover:text-corex-black transition-colors"
          >
            {t('saasBuilder')}
          </a>
          <Link
            href={switchHref}
            className="text-sm font-semibold tracking-wide"
            aria-label={`Switch to ${otherLocale.toUpperCase()}`}
          >
            <span className="text-corex-black">{locale.toUpperCase()}</span>
            <span className="text-gray-border mx-1.5">|</span>
            <span className="text-gray-mid hover:text-corex-black transition-colors">
              {otherLocale.toUpperCase()}
            </span>
          </Link>
        </div>

        <Link
          href={bookingHref}
          className="bg-corex-black text-white text-sm font-semibold rounded-full px-5 py-2.5 hover:bg-green-deep hover:-translate-y-px transition-all duration-200 inline-flex items-center gap-2"
        >
          <span className="hidden sm:inline">{t('booking')} →</span>
          <span className="sm:hidden">{t('bookingShort')}</span>
        </Link>
      </div>
    </nav>
  )
}
