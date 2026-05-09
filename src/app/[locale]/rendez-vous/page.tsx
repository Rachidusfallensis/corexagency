'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { LOGOS, LOGO_SIZES } from '@/lib/assets'
import {
  getAvailabilityData,
  createReservation,
} from '@/lib/booking/actions'
import { hasAnySlotInNext30Days } from '@/lib/booking/availability'
import {
  EMPTY_BOOKING_STATE,
  type AvailabilityBlock,
  type AvailabilityRule,
  type BookingState,
  type Profile,
  type Reservation,
  type Service,
} from '@/lib/types/booking'
import OptionButton from '@/components/booking/OptionButton'
import ProgressBar from '@/components/booking/ProgressBar'
import BookingCalendar from '@/components/booking/BookingCalendar'
import ContactForm from '@/components/booking/ContactForm'
import ConfirmationScreen from '@/components/booking/ConfirmationScreen'
import QueueFallback from '@/components/booking/QueueFallback'

const TOTAL_STEPS = 5
const STEP_LABELS = [
  'Votre projet',
  'Détails',
  'Votre profil',
  'Créneau',
  'Coordonnées',
]
const STEP_HINTS = [
  'Sélectionnez une option pour continuer',
  'Minimum 20 caractères',
  'Sélectionnez votre profil',
  'Choisissez une date et un horaire',
  'Remplissez les champs obligatoires',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const SERVICE_OPTIONS = [
  {
    value: 'digitalisation' as const,
    title: 'Digitalisation',
    desc: 'ERP, CRM, e-commerce, automatisations, site sur mesure',
    iconPath: 'M2 3h20v14H2zM8 21h8M12 17v4',
  },
  {
    value: 'saas' as const,
    title: 'SaaS Builder',
    desc: 'Construire un produit SaaS de A à Z',
    iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    value: 'other' as const,
    title: 'Je ne sais pas encore',
    desc: "Je veux d'abord discuter de mon besoin",
    iconPath: 'M12 8v4l3 3',
  },
]

const PROFILE_OPTIONS = [
  {
    value: 'startup' as const,
    title: 'Startup / Fondateur',
    desc: 'Idée à valider ou lancer',
    iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  },
  {
    value: 'pme' as const,
    title: 'PME / TPE',
    desc: 'Entreprise à digitaliser',
    iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  },
  {
    value: 'freelance' as const,
    title: 'Freelance / Indépendant',
    desc: 'Projet perso ou client',
    iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
  },
  {
    value: 'other' as const,
    title: 'Autre',
    desc: 'Organisation, ONG, autre',
    iconPath: 'M12 12h.01',
  },
]

const PLACEHOLDER_BY_SERVICE: Record<string, string> = {
  digitalisation:
    "Ex : on a une boutique de vêtements et on veut lancer un e-commerce synchronisé avec notre stock physique...",
  saas:
    'Ex : je développe un SaaS de gestion de congés pour TPE. J\'ai un prototype Figma et je cherche une équipe tech...',
  other:
    "Ex : on a un besoin tech mais on n'est pas sûr de la solution. On voudrait en discuter...",
}

function Icon({ d }: { d: string }) {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  )
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [state, setState] = useState<BookingState>(EMPTY_BOOKING_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [stepKey, setStepKey] = useState(0) // forces re-mount for transition

  const [availLoaded, setAvailLoaded] = useState(false)
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    let active = true
    getAvailabilityData()
      .then((data) => {
        if (!active) return
        setRules(data.rules)
        setBlocks(data.blocks)
        setReservations(data.reservations)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setAvailLoaded(true)
      })
    return () => {
      active = false
    }
  }, [])

  const queueMode =
    availLoaded && !hasAnySlotInNext30Days(rules, reservations, blocks)

  function isStepValid(): boolean {
    switch (step) {
      case 1:
        return !!state.service
      case 2:
        return state.projectDesc.trim().length >= 20
      case 3:
        return !!state.profile
      case 4:
        return !!state.selectedDate && !!state.selectedTime
      case 5:
        return (
          !!state.contact.firstname.trim() &&
          !!state.contact.lastname.trim() &&
          EMAIL_RE.test(state.contact.email)
        )
      default:
        return false
    }
  }

  function goToStep(n: number) {
    setStep(n)
    setStepKey((k) => k + 1)
  }

  async function handleNext() {
    if (step < TOTAL_STEPS) {
      goToStep(step + 1)
    } else {
      setSubmitting(true)
      setSubmitError(null)
      const res = await createReservation(state)
      setSubmitting(false)
      if (res.success) {
        goToStep(6)
      } else {
        setSubmitError(res.error ?? 'Erreur')
      }
    }
  }

  function handleBack() {
    if (step > 1 && step <= TOTAL_STEPS) goToStep(step - 1)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* LEFT — green panel */}
      <aside
        className="hidden md:flex flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: '#016B2D' }}
      >
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 80% at 20% 80%, rgba(1,234,98,0.15), transparent 70%)',
          }}
        />
        <Link href="/" className="relative z-[1] flex items-center gap-2.5">
          <Image
            src={LOGOS.blanc}
            alt="Corex"
            width={LOGO_SIZES.booking.width}
            height={LOGO_SIZES.booking.height}
            priority
          />
        </Link>

        <div className="relative z-[1]">
          <h1
            className="font-extrabold text-white leading-[1.1] mb-4"
            style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              letterSpacing: '-0.03em',
            }}
          >
            Parlons de
            <br />
            votre <em className="not-italic" style={{ color: '#01EA62' }}>projet.</em>
          </h1>
          <p
            className="max-w-[340px] text-base"
            style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}
          >
            30 minutes pour comprendre votre situation et voir ensemble comment on peut vous aider.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            {[
              { d: 'M12 8v4l3 3', label: 'Appel de 30 minutes' },
              {
                d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
                label: 'Aucun engagement',
              },
              {
                d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z',
                label: 'Réponse sous 24h si complet',
              },
              {
                d: 'M22 12L18 12 15 21 9 3 6 12 2 12',
                label: 'Proposition personnalisée ensuite',
              },
            ].map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2.5 text-sm"
                style={{ color: 'rgba(255,255,255,0.8)' }}
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    background: 'rgba(1,234,98,0.15)',
                    border: '1px solid rgba(1,234,98,0.25)',
                  }}
                >
                  <svg
                    width={14}
                    height={14}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#01EA62"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={f.d} />
                  </svg>
                </span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-[1] text-[0.78rem]" style={{ color: 'rgba(255,255,255,0.4)' }}>
          © 2026 Corex — Your tech partner, from day one.
        </p>
      </aside>

      {/* RIGHT — form panel */}
      <section className="bg-corex-black flex flex-col" style={{ minHeight: '100vh' }}>
        <ProgressBar
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          stepLabel={step <= TOTAL_STEPS ? STEP_LABELS[step - 1] : 'Demande envoyée'}
        />

        <div className="flex-1 px-10 py-8 overflow-y-auto">
          <div
            key={stepKey}
            style={{ animation: 'fadeInUp 0.45s cubic-bezier(0.4,0,0.2,1)' }}
          >
            {step === 1 && (
              <div>
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#01EA62' }}>
                  Étape 1 sur 5
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                  Quel service vous intéresse ?
                </h2>
                <p
                  className="text-[0.9rem] mb-8"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Sélectionnez l&apos;offre qui correspond à votre besoin.
                </p>
                <div className="flex flex-col gap-3">
                  {SERVICE_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      value={opt.value}
                      selected={state.service === opt.value}
                      onClick={(v) => setState((s) => ({ ...s, service: v as Service }))}
                      icon={<Icon d={opt.iconPath} />}
                      title={opt.title}
                      desc={opt.desc}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#01EA62' }}>
                  Étape 2 sur 5
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                  Décrivez votre projet.
                </h2>
                <p
                  className="text-[0.9rem] mb-6"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Donnez-nous le maximum de contexte. Aucun détail n&apos;est trop petit.
                </p>
                <textarea
                  rows={6}
                  value={state.projectDesc}
                  onChange={(e) =>
                    setState((s) => ({ ...s, projectDesc: e.target.value }))
                  }
                  placeholder={
                    state.service
                      ? PLACEHOLDER_BY_SERVICE[state.service]
                      : "Décrivez votre besoin, votre contexte, vos objectifs..."
                  }
                  className="w-full rounded-2xl px-5 py-4 text-[0.9rem] text-white outline-none resize-none focus:border-green-vivid/50"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    fontFamily: 'inherit',
                    lineHeight: 1.6,
                  }}
                />
                <div
                  className="text-right text-[0.72rem] mt-1.5"
                  style={{
                    color:
                      state.projectDesc.trim().length >= 20
                        ? '#01EA62'
                        : 'rgba(255,255,255,0.25)',
                  }}
                >
                  {state.projectDesc.length} / 500 caractères
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#01EA62' }}>
                  Étape 3 sur 5
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                  Quel est votre profil ?
                </h2>
                <p
                  className="text-[0.9rem] mb-8"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Pour adapter notre approche à votre situation.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PROFILE_OPTIONS.map((opt) => (
                    <OptionButton
                      key={opt.value}
                      value={opt.value}
                      selected={state.profile === opt.value}
                      onClick={(v) => setState((s) => ({ ...s, profile: v as Profile }))}
                      icon={<Icon d={opt.iconPath} />}
                      title={opt.title}
                      desc={opt.desc}
                    />
                  ))}
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#01EA62' }}>
                  Étape 4 sur 5
                </div>
                {queueMode ? (
                  <QueueFallback
                    service={state.service ?? 'other'}
                    profile={state.profile ?? 'other'}
                    projectDesc={state.projectDesc}
                    contact={state.contact}
                  />
                ) : (
                  <>
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                      Choisissez un créneau.
                    </h2>
                    <p
                      className="text-[0.9rem] mb-6"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      Sélectionnez une date puis un horaire qui vous convient.
                    </p>
                    {!availLoaded ? (
                      <p
                        className="text-[0.85rem]"
                        style={{ color: 'rgba(255,255,255,0.5)' }}
                      >
                        Chargement des créneaux…
                      </p>
                    ) : (
                      <BookingCalendar
                        rules={rules}
                        reservations={reservations}
                        blocks={blocks}
                        selectedDate={state.selectedDate}
                        selectedTime={state.selectedTime}
                        onDateSelect={(date) =>
                          setState((s) => ({
                            ...s,
                            selectedDate: date,
                            selectedTime: null,
                          }))
                        }
                        onTimeSelect={(time) =>
                          setState((s) => ({ ...s, selectedTime: time }))
                        }
                      />
                    )}
                  </>
                )}
              </div>
            )}

            {step === 5 && (
              <div>
                <div className="text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: '#01EA62' }}>
                  Étape 5 sur 5
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                  Vos coordonnées.
                </h2>
                <p
                  className="text-[0.9rem] mb-6"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  Pour confirmer votre rendez-vous et vous envoyer les détails.
                </p>
                <ContactForm
                  contact={state.contact}
                  onChange={(field, value) =>
                    setState((s) => ({
                      ...s,
                      contact: { ...s.contact, [field]: value },
                    }))
                  }
                />
                {submitError ? (
                  <p
                    className="mt-4 text-[0.85rem]"
                    style={{ color: '#EF4444' }}
                  >
                    {submitError}
                  </p>
                ) : null}
              </div>
            )}

            {step === 6 && <ConfirmationScreen state={state} />}
          </div>
        </div>

        {step <= TOTAL_STEPS && !(step === 4 && queueMode) ? (
          <div
            className="flex items-center justify-between gap-4 px-10 py-6"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
          >
            <button
              type="button"
              onClick={handleBack}
              className={`rounded-full px-6 py-3 text-[0.875rem] font-medium flex items-center gap-2 transition-all ${
                step === 1 ? 'invisible' : ''
              }`}
              style={{
                background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Retour
            </button>
            <span
              className="text-[0.75rem] text-center hidden sm:block"
              style={{ color: 'rgba(255,255,255,0.25)' }}
            >
              {STEP_HINTS[step - 1]}
            </span>
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid() || submitting}
              className="rounded-full px-8 py-3.5 text-[0.875rem] font-bold flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_8px_25px_rgba(1,234,98,0.3)]"
              style={{
                background: isStepValid() && !submitting ? '#01EA62' : 'rgba(255,255,255,0.1)',
                color: isStepValid() && !submitting ? '#050505' : 'rgba(255,255,255,0.3)',
              }}
            >
              {submitting
                ? 'Envoi…'
                : step === TOTAL_STEPS
                  ? 'Envoyer ma demande'
                  : 'Continuer'}
              {!submitting && (
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          </div>
        ) : null}
      </section>
    </div>
  )
}
