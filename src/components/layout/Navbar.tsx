'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname() ?? `/${locale}`

  function switchTo(target: 'fr' | 'en') {
    const rest = pathname.replace(/^\/(fr|en)/, '') || ''
    router.push(`/${target}${rest}`)
  }

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: '#6B7280',
    fontSize: '0.9rem',
    fontWeight: 500,
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255,255,255,0.93)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Logo gauche */}
        <Link href={`/${locale}`} style={{ display: 'inline-flex' }}>
          <Image
            src="/logos/Corex_Logo_color.png"
            alt="Corex"
            width={120}
            height={40}
            priority
          />
        </Link>

        {/* Liens centre — cachés mobile */}
        <div
          className="hidden md:flex"
          style={{
            alignItems: 'center',
            gap: '2rem',
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Link href={`/${locale}#offres`} style={linkStyle}>
            {t('offers')}
          </Link>
          <Link href={`/${locale}/projets`} style={linkStyle}>
            {t('projects')}
          </Link>
          <Link href={`/${locale}#processus`} style={linkStyle}>
            {t('howItWorks')}
          </Link>
          <Link href={`/${locale}#saas`} style={linkStyle}>
            {t('saasBuilder')}
          </Link>

          {/* Switch langue */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <span
              role="button"
              tabIndex={0}
              onClick={() => switchTo('fr')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') switchTo('fr')
              }}
              style={{
                color: locale === 'fr' ? '#050505' : '#9CA3AF',
                cursor: 'pointer',
              }}
            >
              FR
            </span>
            <span style={{ color: '#D1D5DB' }}>|</span>
            <span
              role="button"
              tabIndex={0}
              onClick={() => switchTo('en')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') switchTo('en')
              }}
              style={{
                color: locale === 'en' ? '#050505' : '#9CA3AF',
                cursor: 'pointer',
              }}
            >
              EN
            </span>
          </div>
        </div>

        {/* CTA droite */}
        <Link
          href={`/${locale}/rendez-vous`}
          style={{
            background: '#050505',
            color: '#ffffff',
            padding: '0.6rem 1.4rem',
            borderRadius: '50px',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            transition: 'background 0.2s',
          }}
        >
          {t('booking')} →
        </Link>
      </div>
    </nav>
  )
}
