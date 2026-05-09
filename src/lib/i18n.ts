import { getRequestConfig } from 'next-intl/server'

const locales = ['fr', 'en'] as const
type Locale = (typeof locales)[number]

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale: Locale = (locales as readonly string[]).includes(requested ?? '')
    ? (requested as Locale)
    : 'fr'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
