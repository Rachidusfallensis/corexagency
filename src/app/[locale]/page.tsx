import { useTranslations } from 'next-intl'

export default function HomePage() {
  const t = useTranslations('hero')
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white">
          {t('title')}{' '}
          <em className="not-italic text-green-vivid">{t('titleEm')}</em>
        </h1>
        <p className="text-gray-mid mt-4">Corex — Coming soon</p>
      </div>
    </main>
  )
}
