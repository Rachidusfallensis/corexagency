import Link from 'next/link'
import { useLocale } from 'next-intl'
import type { BookingState } from '@/lib/types/booking'

const SERVICE_LABELS: Record<string, string> = {
  digitalisation: 'Digitalisation',
  saas: 'SaaS Builder',
  other: 'Non déterminé',
}
const PROFILE_LABELS: Record<string, string> = {
  startup: 'Startup / Fondateur',
  pme: 'PME / TPE',
  freelance: 'Freelance',
  other: 'Autre',
}
const MONTHS_SHORT = [
  'jan',
  'fév',
  'mar',
  'avr',
  'mai',
  'juin',
  'juil',
  'août',
  'sep',
  'oct',
  'nov',
  'déc',
]

function formatSlot(state: BookingState): string {
  if (!state.selectedDate || !state.selectedTime) return '-'
  const [y, m, d] = state.selectedDate.split('-').map(Number)
  return `${d} ${MONTHS_SHORT[m - 1]} ${y} à ${state.selectedTime}`
}

export default function ConfirmationScreen({ state }: { state: BookingState }) {
  const locale = useLocale()
  const homeHref = `/${locale}`

  return (
    <div className="text-center py-4">
      <div
        className="w-[72px] h-[72px] mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{
          background: 'rgba(1,234,98,0.12)',
          border: '2px solid #01EA62',
          animation: 'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth={2.5}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h2 className="text-[1.6rem] font-bold mb-3 text-white">Demande envoyée !</h2>
      <p
        className="max-w-[320px] mx-auto mb-8 text-[0.9rem]"
        style={{ color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}
      >
        On a bien reçu votre demande. Nous la confirmerons dans les 24h et vous enverrons un email de confirmation.
      </p>

      <div
        className="text-left max-w-md mx-auto rounded-2xl p-5 mb-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {[
          ['Service', state.service ? SERVICE_LABELS[state.service] : '-', true],
          ['Profil', state.profile ? PROFILE_LABELS[state.profile] : '-', false],
          ['Créneau demandé', formatSlot(state), false],
          [
            'Contact',
            `${state.contact.firstname} ${state.contact.lastname}`.trim() || '-',
            false,
          ],
          ['Email', state.contact.email || '-', false],
        ].map(([k, v, green], i, arr) => (
          <div
            key={k as string}
            className="flex justify-between items-center py-2"
            style={{
              borderBottom:
                i < arr.length - 1
                  ? '1px solid rgba(255,255,255,0.06)'
                  : 'none',
            }}
          >
            <span className="text-[0.78rem]" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {k as string}
            </span>
            <span
              className="text-[0.85rem] font-semibold"
              style={{ color: green ? '#01EA62' : '#fff' }}
            >
              {v as string}
            </span>
          </div>
        ))}
      </div>

      <Link
        href={homeHref}
        className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.875rem] font-medium transition-all"
        style={{
          background: 'rgba(255,255,255,0.06)',
          color: 'rgba(255,255,255,0.6)',
        }}
      >
        ← Retour au site
      </Link>
    </div>
  )
}
