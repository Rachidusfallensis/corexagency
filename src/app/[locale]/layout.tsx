import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import type { Metadata, Viewport } from 'next'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const locales = ['fr', 'en'] as const

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: 'Corex — Your tech partner, from day one.',
  description:
    "Digitalisation d'entreprise et SaaS Builder. Votre partenaire tech de A à Z.",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Corex',
  },
  icons: {
    apple: '/logos/Corex_Logo_icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#016B2D',
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(locales, locale)) notFound()

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} className={inter.variable}>
      <body className="font-sans bg-corex-black text-white">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
