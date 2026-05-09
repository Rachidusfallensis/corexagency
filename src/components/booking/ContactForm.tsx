'use client'

import type { BookingState } from '@/lib/types/booking'

type ContactField = keyof BookingState['contact']

type ContactFormProps = {
  contact: BookingState['contact']
  onChange: (field: ContactField, value: string) => void
}

const inputClass =
  'w-full rounded-xl px-4 py-3 text-[0.9rem] text-white outline-none transition-colors'
const inputStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.04)',
  border: '1.5px solid rgba(255,255,255,0.1)',
  fontFamily: 'inherit',
}
const labelClass =
  'text-[0.78rem] font-semibold uppercase tracking-[0.06em] mb-1.5'
const labelStyle: React.CSSProperties = { color: 'rgba(255,255,255,0.5)' }

export default function ContactForm({ contact, onChange }: ContactFormProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col">
          <label className={labelClass} style={labelStyle}>
            Prénom
          </label>
          <input
            type="text"
            value={contact.firstname}
            onChange={(e) => onChange('firstname', e.target.value)}
            placeholder="Jean"
            className={`${inputClass} focus:border-green-vivid/50`}
            style={inputStyle}
          />
        </div>
        <div className="flex flex-col">
          <label className={labelClass} style={labelStyle}>
            Nom
          </label>
          <input
            type="text"
            value={contact.lastname}
            onChange={(e) => onChange('lastname', e.target.value)}
            placeholder="Dupont"
            className={`${inputClass} focus:border-green-vivid/50`}
            style={inputStyle}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className={labelClass} style={labelStyle}>
          Email professionnel
        </label>
        <input
          type="email"
          value={contact.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="jean@entreprise.com"
          className={`${inputClass} focus:border-green-vivid/50`}
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClass} style={labelStyle}>
          Téléphone <span className="font-normal normal-case opacity-50">(optionnel)</span>
        </label>
        <input
          type="tel"
          value={contact.phone}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="+1 514 000 0000"
          className={`${inputClass} focus:border-green-vivid/50`}
          style={inputStyle}
        />
      </div>

      <div className="flex flex-col">
        <label className={labelClass} style={labelStyle}>
          Entreprise <span className="font-normal normal-case opacity-50">(optionnel)</span>
        </label>
        <input
          type="text"
          value={contact.company}
          onChange={(e) => onChange('company', e.target.value)}
          placeholder="Nom de votre entreprise"
          className={`${inputClass} focus:border-green-vivid/50`}
          style={inputStyle}
        />
      </div>
    </div>
  )
}
