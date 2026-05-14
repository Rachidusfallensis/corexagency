'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

const FOOTER_CSS = `
.corex-footer { background:#050505; padding:4rem 0 2rem; border-top:1px solid rgba(255,255,255,0.06); font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif }
.corex-footer .container { max-width:1200px; margin:0 auto; padding:0 2rem }
.corex-footer .footer-inner { display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:3rem; margin-bottom:3rem }
.corex-footer .footer-brand p { color:rgba(255,255,255,0.45); font-size:0.875rem; margin-top:1rem; max-width:240px; line-height:1.6 }
.corex-footer .footer-col h5 { color:#fff; font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:1.25rem }
.corex-footer .footer-col a { display:block; color:rgba(255,255,255,0.45); text-decoration:none; font-size:0.875rem; margin-bottom:0.6rem; transition:color 0.2s }
.corex-footer .footer-col a:hover { color:#01EA62 }
.corex-footer .footer-bottom { border-top:1px solid rgba(255,255,255,0.06); padding-top:2rem; display:flex; justify-content:space-between; align-items:center; gap:1rem; flex-wrap:wrap }
.corex-footer .footer-bottom p { color:rgba(255,255,255,0.3); font-size:0.8rem; margin:0 }
.corex-footer .footer-bottom span { color:#01EA62 }
@media (max-width: 960px) { .corex-footer .footer-inner { grid-template-columns:1fr 1fr } }
@media (max-width: 768px) { .corex-footer .footer-inner { grid-template-columns:1fr 1fr !important; gap:2rem !important } }
@media (max-width: 480px) { .corex-footer .footer-inner { grid-template-columns:1fr !important } }
`

export default function Footer() {
  const t = useTranslations()
  const locale = useLocale()

  const home = `/${locale}`
  const projects = `/${locale}/projets`

  return (
    <footer className="corex-footer">
      <style dangerouslySetInnerHTML={{ __html: FOOTER_CSS }} />
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <Link
              href={home}
              style={{ display: 'inline-flex', marginBottom: '0.5rem', textDecoration: 'none' }}
            >
              <Image
                src="/logos/Corex_Logo_Blanc.png"
                alt="Corex"
                width={100}
                height={33}
                style={{ display: 'block' }}
              />
            </Link>
            <p>{t('footer.tagline')}</p>
          </div>

          <div className="footer-col">
            <h5>{t('footer.col1Title')}</h5>
            <Link href={`${home}/digitalisation`}>{t('footer.digitalisation')}</Link>
            <Link href={projects}>{t('footer.projects')}</Link>
            <Link href={`${home}/saas-builder`}>{t('footer.saasBuilder')}</Link>
            <a href={`${home}#processus`}>{t('footer.process')}</a>
          </div>

          <div className="footer-col">
            <h5>{t('footer.col2Title')}</h5>
            <Link href={`${home}/a-propos`}>{t('footer.about')}</Link>
            <a href={`${home}#contact`}>{t('footer.contact')}</a>
          </div>

          <div className="footer-col">
            <h5>{t('footer.col3Title')}</h5>
            <a href={`mailto:${t('footer.email')}`}>{t('footer.email')}</a>
            <Link href={`${home}/rendez-vous`}>{t('footer.bookingLink')}</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <p>{t('footer.copyright')}</p>
          <p
            dangerouslySetInnerHTML={{
              __html: t('footer.madeWith').replace('♥', '<span>♥</span>'),
            }}
          />
        </div>
      </div>
    </footer>
  )
}
