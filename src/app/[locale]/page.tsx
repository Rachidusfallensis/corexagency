import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { LOGOS } from '@/lib/assets'

export default function HomePage() {
  const tHero = useTranslations('hero')
  const locale = useLocale()

  return (
    <section className="bg-corex-black min-h-[calc(100vh-4rem)] flex items-center justify-center px-8">
      <div className="text-center max-w-2xl flex flex-col items-center gap-8">
        <Image
          src={LOGOS.blanc}
          alt="Corex"
          width={200}
          height={67}
          priority
        />

        <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
          {tHero('title')}{' '}
          <em className="not-italic text-green-vivid">{tHero('titleEm')}</em>
        </h1>

        <p className="text-base md:text-lg text-gray-mid max-w-md">
          {tHero('desc')}
        </p>

        <Link
          href={`/${locale}/rendez-vous`}
          className="bg-green-vivid text-corex-black font-bold text-base rounded-full px-8 py-4 inline-flex items-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(1,234,98,0.3)] transition-all duration-200"
        >
          {tHero('ctaSecondary')} →
        </Link>
      </div>
    </section>
  )
}
