'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { LOGOS } from '@/lib/assets'
import {
  createQueueEntry,
  createReservation,
  getAvailabilityData,
} from '@/lib/booking/actions'
import {
  dateKey,
  generateSlots,
  hasAnySlotInNext30Days,
  isDateBlocked,
} from '@/lib/booking/availability'
import { getVisitorTimezone } from '@/lib/timezone'
import {
  EMPTY_BOOKING_STATE,
  type AvailabilityBlock,
  type AvailabilityRule,
  type BookingState,
  type Profile,
  type Reservation,
  type Service,
  type Urgency,
} from '@/lib/types/booking'

const PROTO_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
.proto-booking,.proto-booking *{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
.proto-booking{background:#050505;color:#fff;height:100vh;overflow:hidden}

.booking-wrap{display:grid;grid-template-columns:1fr 1fr;height:100vh}

.left-panel{background:#016B2D;display:flex;flex-direction:column;justify-content:space-between;padding:2.5rem;position:relative;overflow:hidden}
.left-panel::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 20% 80%,rgba(1,234,98,0.15),transparent 70%);pointer-events:none}
.left-panel::after{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}
.left-logo{display:flex;align-items:center;gap:10px;text-decoration:none;position:relative;z-index:1}
.proto-booking .logo-mark{width:36px;height:36px;background:rgba(255,255,255,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(10px)}
.logo-text{font-size:1.1rem;font-weight:700;color:#fff;letter-spacing:-0.02em}
.left-content{position:relative;z-index:1}
.left-content h1{font-size:clamp(1.8rem,3vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-0.03em;margin-bottom:1rem}
.left-content h1 em{font-style:normal;color:#01EA62}
.left-content p{color:rgba(255,255,255,0.65);font-size:1rem;line-height:1.7;max-width:340px}
.left-features{display:flex;flex-direction:column;gap:0.75rem;margin-top:2rem;position:relative;z-index:1}
.left-feature{display:flex;align-items:center;gap:10px;font-size:0.875rem;color:rgba(255,255,255,0.8)}
.feat-icon{width:28px;height:28px;border-radius:8px;background:rgba(1,234,98,0.15);border:1px solid rgba(1,234,98,0.25);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.left-bottom{position:relative;z-index:1}
.left-bottom p{font-size:0.78rem;color:rgba(255,255,255,0.4)}

.right-panel{background:#050505;display:flex;flex-direction:column;overflow:hidden;position:relative}

.progress-bar-wrap{padding:2rem 2.5rem 0;flex-shrink:0}
.progress-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem}
.progress-label{font-size:0.78rem;color:rgba(255,255,255,0.4);font-weight:500}
.progress-step{font-size:0.78rem;color:#01EA62;font-weight:600}
.progress-track{height:3px;background:rgba(255,255,255,0.08);border-radius:2px;overflow:hidden}
.progress-fill{height:100%;background:linear-gradient(90deg,#016B2D,#01EA62);border-radius:2px;transition:width 0.5s cubic-bezier(0.4,0,0.2,1)}

.steps-container{flex:1;overflow:hidden;position:relative}
.step{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:center;padding:2.5rem;opacity:0;transform:translateX(60px);transition:all 0.45s cubic-bezier(0.4,0,0.2,1);pointer-events:none;overflow-y:auto}
.step.active{opacity:1;transform:translateX(0);pointer-events:all}
.proto-booking .step-num{font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:#01EA62;margin-bottom:1rem}
.step h2{font-size:clamp(1.4rem,2.5vw,2rem);font-weight:700;line-height:1.2;letter-spacing:-0.02em;margin-bottom:0.6rem}
.step .step-desc{font-size:0.9rem;color:rgba(255,255,255,0.5);margin-bottom:2rem}

.options-grid{display:flex;flex-direction:column;gap:0.75rem}
.option-btn{display:flex;align-items:center;gap:1rem;padding:1rem 1.25rem;border-radius:14px;border:1.5px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);cursor:pointer;transition:all 0.2s;text-align:left;color:#fff;font-size:0.9rem;font-weight:500}
.option-btn:hover{border-color:rgba(1,234,98,0.4);background:rgba(1,234,98,0.05);transform:translateX(4px)}
.option-btn.selected{border-color:#01EA62;background:rgba(1,234,98,0.08)}
.option-icon{width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background 0.2s}
.option-btn.selected .option-icon{background:rgba(1,234,98,0.15)}
.option-text h4{font-size:0.9rem;font-weight:600;margin-bottom:0.1rem}
.option-text p{font-size:0.78rem;color:rgba(255,255,255,0.45);line-height:1.4}
.option-btn.selected .option-text p{color:rgba(1,234,98,0.7)}
.option-check{margin-left:auto;width:20px;height:20px;border-radius:50%;border:1.5px solid rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s}
.option-btn.selected .option-check{background:#01EA62;border-color:#01EA62}

.step-textarea{width:100%;background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.1);border-radius:14px;padding:1.1rem 1.25rem;color:#fff;font-size:0.9rem;font-family:inherit;resize:none;transition:border-color 0.2s;outline:none;line-height:1.6}
.step-textarea:focus{border-color:rgba(1,234,98,0.5)}
.step-textarea::placeholder{color:rgba(255,255,255,0.25)}
.char-count{text-align:right;font-size:0.72rem;color:rgba(255,255,255,0.25);margin-top:0.4rem}

.input-group{display:flex;flex-direction:column;gap:0.75rem}
.input-row{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}
.input-field{display:flex;flex-direction:column;gap:0.4rem}
.input-field label{font-size:0.78rem;font-weight:600;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.06em}
.input-field input{background:rgba(255,255,255,0.04);border:1.5px solid rgba(255,255,255,0.1);border-radius:12px;padding:0.9rem 1.1rem;color:#fff;font-size:0.9rem;font-family:inherit;outline:none;transition:border-color 0.2s}
.input-field input:focus{border-color:rgba(1,234,98,0.5)}
.input-field input::placeholder{color:rgba(255,255,255,0.2)}

.calendar-wrap{display:flex;flex-direction:column;gap:1.25rem}
.cal-header{display:flex;align-items:center;justify-content:space-between}
.cal-header h4{font-size:0.95rem;font-weight:600}
.cal-nav{display:flex;gap:0.5rem}
.cal-nav-btn{width:32px;height:32px;border-radius:8px;border:1.5px solid rgba(255,255,255,0.1);background:transparent;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s}
.cal-nav-btn:hover:not(:disabled){border-color:rgba(1,234,98,0.4);background:rgba(1,234,98,0.06)}
.cal-nav-btn:disabled{opacity:0.3;cursor:not-allowed}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.cal-day-label{font-size:0.68rem;font-weight:600;text-align:center;color:rgba(255,255,255,0.3);text-transform:uppercase;letter-spacing:0.05em;padding:0.3rem 0}
.cal-day{aspect-ratio:1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:0.8rem;cursor:pointer;transition:all 0.2s;border:1.5px solid transparent}
.cal-day.empty{cursor:default}
.cal-day.past{color:rgba(255,255,255,0.15);cursor:not-allowed}
.cal-day.available{color:rgba(255,255,255,0.7);background:rgba(255,255,255,0.04)}
.cal-day.available:hover{background:rgba(1,234,98,0.1);border-color:rgba(1,234,98,0.3);color:#fff}
.cal-day.selected{background:rgba(1,234,98,0.15);border-color:#01EA62;color:#01EA62;font-weight:700}
.cal-day.unavailable{color:rgba(255,255,255,0.15);cursor:not-allowed;text-decoration:line-through}
.time-slots{display:grid;grid-template-columns:repeat(3,1fr);gap:0.5rem}
.time-slot{padding:0.6rem 0.5rem;border-radius:10px;border:1.5px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.7);font-size:0.8rem;font-weight:500;text-align:center;cursor:pointer;transition:all 0.2s}
.time-slot:hover{border-color:rgba(1,234,98,0.4);background:rgba(1,234,98,0.06);color:#fff}
.time-slot.selected{border-color:#01EA62;background:rgba(1,234,98,0.12);color:#01EA62;font-weight:600}
.time-slot.unavailable{opacity:0.25;cursor:not-allowed;text-decoration:line-through}
.slots-label{font-size:0.75rem;color:rgba(255,255,255,0.35);margin-bottom:0.5rem;font-weight:500}

.confirmation{text-align:center;padding:1rem 0}
.check-circle{width:72px;height:72px;border-radius:50%;background:rgba(1,234,98,0.12);border:2px solid #01EA62;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)}
@keyframes popIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
.confirmation h2{font-size:1.6rem;margin-bottom:0.75rem}
.confirmation p{color:rgba(255,255,255,0.55);font-size:0.9rem;max-width:320px;margin:0 auto 2rem}
.recap-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:16px;padding:1.25rem;text-align:left;margin-bottom:1.5rem}
.recap-item{display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.06)}
.recap-item:last-child{border-bottom:none}
.recap-item span:first-child{font-size:0.78rem;color:rgba(255,255,255,0.4)}
.recap-item span:last-child{font-size:0.85rem;font-weight:600;color:#fff}
.recap-item span.green{color:#01EA62}

.bottom-nav{padding:1.5rem 2.5rem;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
.btn-back{background:transparent;border:1.5px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.5);padding:0.75rem 1.5rem;border-radius:50px;font-size:0.875rem;font-weight:500;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:8px}
.btn-back:hover{border-color:rgba(255,255,255,0.3);color:#fff}
.btn-back.hidden{visibility:hidden}
.btn-next{background:#01EA62;color:#050505;padding:0.85rem 2rem;border-radius:50px;font-size:0.875rem;font-weight:700;cursor:pointer;border:none;transition:all 0.2s;display:flex;align-items:center;gap:8px}
.btn-next:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 25px rgba(1,234,98,0.3)}
.btn-next:disabled{background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.3);cursor:not-allowed;transform:none;box-shadow:none}
.step-hint{font-size:0.75rem;color:rgba(255,255,255,0.25);text-align:center}

.profile-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.75rem}

@media(max-width:768px){
  .booking-wrap{grid-template-columns:1fr !important}
  .left-panel{display:none !important}
  .proto-booking{overflow:auto;height:auto}
  .right-panel{min-height:100vh;height:100vh}
  .step{padding:1.5rem !important;position:relative;transform:none;opacity:1;pointer-events:all;display:none}
  .step.active{display:flex}
  .input-row{grid-template-columns:1fr !important}
  .profile-grid{grid-template-columns:1fr !important}
  .time-slots{grid-template-columns:repeat(2,1fr) !important}
}
`

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
  'Choisissez date et horaire',
  'Remplissez les champs obligatoires',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^(?:\+[\d\s-]{8,}|\d{10,})$/

const SERVICE_OPTIONS = [
  {
    value: 'digitalisation' as Service,
    title: 'Digitalisation',
    desc: 'ERP, CRM, e-commerce, automatisations, site sur mesure',
    iconPath: 'M2 3h20v14H2zM8 21h8M12 17v4',
  },
  {
    value: 'saas' as Service,
    title: 'SaaS Builder',
    desc: 'Construire un produit SaaS de A à Z',
    iconPath: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  {
    value: 'other' as Service,
    title: 'Je ne sais pas encore',
    desc: "Je veux d'abord discuter de mon besoin",
    iconPath: 'M12 8v4l3 3',
  },
]

const PROFILE_OPTIONS = [
  {
    value: 'startup' as Profile,
    title: 'Startup / Fondateur',
    desc: 'Idée à valider ou lancer',
    iconPath: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  },
  {
    value: 'pme' as Profile,
    title: 'PME / TPE',
    desc: 'Entreprise à digitaliser',
    iconPath: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  },
  {
    value: 'freelance' as Profile,
    title: 'Freelance / Indépendant',
    desc: 'Projet perso ou client',
    iconPath: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2',
  },
  {
    value: 'other' as Profile,
    title: 'Autre',
    desc: 'Organisation, ONG, autre',
    iconPath: 'M12 12h.01',
  },
]

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
const MONTHS_FULL = [
  'Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre',
]
const MONTHS_SHORT = [
  'jan','fév','mar','avr','mai','juin','juil','août','sep','oct','nov','déc',
]
const DAY_NAMES = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']
const DAY_LABELS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']

const PLACEHOLDER_BY_SERVICE: Record<string, string> = {
  digitalisation: "Ex : on a une boutique de vêtements et on veut lancer un e-commerce synchronisé avec notre stock physique...",
  saas: "Ex : je développe un SaaS de gestion de congés pour TPE. J'ai un prototype Figma et je cherche une équipe tech...",
  other: "Ex : on a un besoin tech mais on n'est pas sûr de la solution. On voudrait en discuter...",
}

function Icon({ d }: { d: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const URGENCIES: Array<{ value: Urgency; label: string }> = [
  { value: 'high', label: "Dans moins d'une semaine" },
  { value: 'medium', label: 'Dans le mois' },
  { value: 'low', label: 'Pas pressé' },
]

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export default function BookingPage() {
  const locale = useLocale()
  const homeHref = `/${locale}`

  const [step, setStep] = useState(1)
  const [state, setState] = useState<BookingState>(EMPTY_BOOKING_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  // UTC date for the picked slot (separate from visitor-local selectedDate driving the calendar)
  const [selectedUtcDate, setSelectedUtcDate] = useState<string | null>(null)

  useEffect(() => {
    try {
      const savedState = sessionStorage.getItem('corex_booking_state')
      if (savedState) setState(JSON.parse(savedState))
      
      const savedStep = sessionStorage.getItem('corex_booking_step')
      if (savedStep) {
        const p = parseInt(savedStep, 10)
        // Don't auto-restore confirmation step
        if (p >= 1 && p < 6) setStep(p)
      }
    } catch (e) {}
  }, [])

  useEffect(() => {
    if (step < 6) {
      sessionStorage.setItem('corex_booking_state', JSON.stringify(state))
      sessionStorage.setItem('corex_booking_step', step.toString())
    }
  }, [state, step])

  const [availLoaded, setAvailLoaded] = useState(false)
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  // Calendar internal state
  const today = useMemo(() => startOfDay(new Date()), [])
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())

  // Visitor timezone (detected client-side)
  const [visitorTz, setVisitorTz] = useState<string>('UTC')
  useEffect(() => {
    setVisitorTz(getVisitorTimezone())
  }, [])

  // Queue fallback state
  const [urgency, setUrgency] = useState<Urgency>('medium')
  const [queueSubmitted, setQueueSubmitted] = useState(false)
  const [queueLoading, setQueueLoading] = useState(false)
  const [queueError, setQueueError] = useState<string | null>(null)

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

  const queueMode = availLoaded && !hasAnySlotInNext30Days(rules, reservations, blocks)

  function isStepValid(): boolean {
    switch (step) {
      case 1: return !!state.service
      case 2: return state.projectDesc.trim().length >= 20
      case 3: return !!state.profile
      case 4: return !!state.selectedDate && !!state.selectedTime
      case 5:
        const validPhone = !state.contact.phone || PHONE_RE.test(state.contact.phone.trim())
        return !!state.contact.firstname.trim() &&
          !!state.contact.lastname.trim() &&
          EMAIL_RE.test(state.contact.email) &&
          validPhone
      default: return false
    }
  }

  async function handleNext() {
    if (step < TOTAL_STEPS) {
      setStep(step + 1)
    } else {
      setSubmitting(true)
      setSubmitError(null)
      // Build a state with the UTC slot date for DB storage
      const stateForDB = selectedUtcDate
        ? { ...state, selectedDate: selectedUtcDate }
        : state
      const res = await createReservation(stateForDB, visitorTz || undefined)
      setSubmitting(false)
      if (res.success) {
        sessionStorage.removeItem('corex_booking_state')
        sessionStorage.removeItem('corex_booking_step')
        setStep(6)
      } else {
        if (res.error?.includes('Ce créneau vient d\'être pris')) {
          setSubmitError(res.error)
          setStep(4) // Retour au calendrier
          // Refresh availability
          setAvailLoaded(false)
          getAvailabilityData().then((data) => {
            setRules(data.rules)
            setBlocks(data.blocks)
            setReservations(data.reservations)
            setAvailLoaded(true)
          }).catch(() => {})
        } else {
          setSubmitError(res.error ?? 'Erreur')
        }
      }
    }
  }
  function handleBack() {
    if (step > 1 && step <= TOTAL_STEPS) setStep(step - 1)
  }

  async function submitQueue() {
    setQueueLoading(true)
    setQueueError(null)
    const res = await createQueueEntry({
      service: state.service ?? 'other',
      profile: state.profile ?? 'other',
      projectDesc: state.projectDesc,
      contact: state.contact,
      urgency,
    })
    setQueueLoading(false)
    if (res.success) setQueueSubmitted(true)
    else setQueueError(res.error ?? 'Erreur')
  }

  // Calendar helpers
  const minMonthAbs = today.getFullYear() * 12 + today.getMonth()
  const maxMonthAbs = minMonthAbs + 2
  const curAbs = calYear * 12 + calMonth
  function changeMonth(delta: number) {
    const next = curAbs + delta
    if (next < minMonthAbs || next > maxMonthAbs) return
    setCalYear(Math.floor(next / 12))
    setCalMonth(next % 12)
    setState((s) => ({ ...s, selectedDate: null, selectedTime: null }))
    setSelectedUtcDate(null)
  }

  const firstDow = new Date(calYear, calMonth, 1).getDay()
  const offset = firstDow === 0 ? 6 : firstDow - 1
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()

  const selDateObj = state.selectedDate
    ? (() => {
        const [y, m, d] = state.selectedDate.split('-').map(Number)
        return new Date(y, m - 1, d)
      })()
    : null
  const slots = selDateObj
    ? generateSlots(selDateObj, rules, reservations, blocks, visitorTz || undefined)
    : []
  const slotsLabel = selDateObj
    ? `${DAY_NAMES[selDateObj.getDay()]} ${selDateObj.getDate()} ${MONTHS_FULL[selDateObj.getMonth()].toLowerCase()}`
    : ''

  const pct = step <= TOTAL_STEPS ? (step / TOTAL_STEPS) * 100 : 100
  const stepLabel = step <= TOTAL_STEPS ? STEP_LABELS[step - 1] : 'Demande envoyée'

  function recapDate(): string {
    if (!state.selectedDate || !state.selectedTime) return '-'
    const [y, m, d] = state.selectedDate.split('-').map(Number)
    return `${d} ${MONTHS_SHORT[m - 1]} ${y} à ${state.selectedTime}`
  }

  const showBottomNav = step <= TOTAL_STEPS && !(step === 4 && queueMode)

  return (
    <div className="proto-booking">
      <style dangerouslySetInnerHTML={{ __html: PROTO_CSS }} />

      <div className="booking-wrap">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <Link href={homeHref} className="left-logo">
            <Image
              src={LOGOS.blanc}
              alt="Corex"
              width={110}
              height={37}
              priority
              style={{ display: 'block' }}
            />
          </Link>

          <div className="left-content">
            <h1>
              Parlons de
              <br />
              votre <em>projet.</em>
            </h1>
            <p>30 minutes pour comprendre votre situation et voir ensemble comment on peut vous aider.</p>
            <div className="left-features">
              {[
                { d: 'M12 8v4l3 3', label: 'Appel de 30 minutes', circle: true },
                { d: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label: 'Aucun engagement' },
                { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z', label: 'Réponse sous 24h si complet' },
                { d: 'M22 12L18 12 15 21 9 3 6 12 2 12', label: 'Proposition personnalisée ensuite' },
              ].map((f) => (
                <div key={f.label} className="left-feature">
                  <div className="feat-icon">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      {f.circle && <circle cx="12" cy="12" r="10" />}
                      <path d={f.d} />
                    </svg>
                  </div>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          <div className="left-bottom">
            <p>© 2026 Corex · Your tech partner, from day one.</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* Progress */}
          <div className="progress-bar-wrap">
            <div className="progress-top">
              <span className="progress-label">{stepLabel}</span>
              <span className="progress-step">
                {step <= TOTAL_STEPS ? `${step} / ${TOTAL_STEPS}` : ''}
              </span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
          </div>

          {/* Steps */}
          <div className="steps-container">
            {/* STEP 1 — Service */}
            <div className={`step${step === 1 ? ' active' : ''}`}>
              <div className="step-num">Étape 1 sur 5</div>
              <h2>Quel service vous intéresse&nbsp;?</h2>
              <p className="step-desc">Sélectionnez l&apos;offre qui correspond à votre besoin.</p>
              <div className="options-grid">
                {SERVICE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`option-btn${state.service === opt.value ? ' selected' : ''}`}
                    onClick={() => setState((s) => ({ ...s, service: opt.value }))}
                  >
                    <div className="option-icon"><Icon d={opt.iconPath} /></div>
                    <div className="option-text">
                      <h4>{opt.title}</h4>
                      <p>{opt.desc}</p>
                    </div>
                    <div className="option-check">
                      {state.service === opt.value && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 2 — Projet */}
            <div className={`step${step === 2 ? ' active' : ''}`}>
              <div className="step-num">Étape 2 sur 5</div>
              <h2>Décrivez votre projet.</h2>
              <p className="step-desc">Donnez-nous le maximum de contexte. Aucun détail n&apos;est trop petit.</p>
              <textarea
                className="step-textarea"
                rows={6}
                value={state.projectDesc}
                onChange={(e) => setState((s) => ({ ...s, projectDesc: e.target.value }))}
                placeholder={state.service ? PLACEHOLDER_BY_SERVICE[state.service] : 'Décrivez votre besoin...'}
              />
              <div className="char-count">
                <span style={{ color: state.projectDesc.trim().length >= 20 ? '#01EA62' : 'inherit' }}>
                  {state.projectDesc.length}
                </span> / 500 caractères
              </div>
            </div>

            {/* STEP 3 — Profil */}
            <div className={`step${step === 3 ? ' active' : ''}`}>
              <div className="step-num">Étape 3 sur 5</div>
              <h2>Quel est votre profil&nbsp;?</h2>
              <p className="step-desc">Pour adapter notre approche à votre situation.</p>
              <div className="profile-grid">
                {PROFILE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`option-btn${state.profile === opt.value ? ' selected' : ''}`}
                    onClick={() => setState((s) => ({ ...s, profile: opt.value }))}
                  >
                    <div className="option-icon"><Icon d={opt.iconPath} /></div>
                    <div className="option-text">
                      <h4>{opt.title}</h4>
                      <p>{opt.desc}</p>
                    </div>
                    <div className="option-check">
                      {state.profile === opt.value && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#050505" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* STEP 4 — Calendrier ou Queue */}
            <div className={`step${step === 4 ? ' active' : ''}`}>
              <div className="step-num">Étape 4 sur 5</div>
              {queueMode ? (
                queueSubmitted ? (
                  <div className="confirmation">
                    <div className="check-circle">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h2>Vous êtes sur la liste !</h2>
                    <p>Nous vous contacterons dès qu&apos;un créneau se libère.</p>
                  </div>
                ) : (
                  <>
                    <h2>Aucun créneau disponible</h2>
                    <p className="step-desc">Rejoignez la liste d&apos;attente. On vous contacte dès qu&apos;un créneau se libère.</p>
                    <div className="options-grid" style={{ marginBottom: '1.5rem' }}>
                      {URGENCIES.map((u) => (
                        <button
                          key={u.value}
                          type="button"
                          className={`option-btn${urgency === u.value ? ' selected' : ''}`}
                          onClick={() => setUrgency(u.value)}
                          style={{ justifyContent: 'space-between' }}
                        >
                          <span>{u.label}</span>
                          {urgency === u.value && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                    {queueError && <p style={{ color: '#EF4444', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{queueError}</p>}
                    <button
                      type="button"
                      onClick={submitQueue}
                      disabled={queueLoading}
                      className="btn-next"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      {queueLoading ? 'Envoi…' : "Rejoindre la liste d'attente"}
                    </button>
                  </>
                )
              ) : (
                <>
                  <h2>Choisissez un créneau.</h2>
                  <p className="step-desc">Sélectionnez une date puis un horaire qui vous convient.</p>
                  {!availLoaded ? (
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Chargement des créneaux…</p>
                  ) : (
                    <div className="calendar-wrap">
                      <div className="cal-header">
                        <h4>{MONTHS_FULL[calMonth]} {calYear}</h4>
                        <div className="cal-nav">
                          <button type="button" className="cal-nav-btn" onClick={() => changeMonth(-1)} disabled={curAbs <= minMonthAbs} aria-label="Mois précédent">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
                          </button>
                          <button type="button" className="cal-nav-btn" onClick={() => changeMonth(1)} disabled={curAbs >= maxMonthAbs} aria-label="Mois suivant">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
                          </button>
                        </div>
                      </div>

                      <div className="cal-grid">
                        {DAY_LABELS.map((d) => (
                          <div key={d} className="cal-day-label">{d}</div>
                        ))}
                        {Array.from({ length: offset }).map((_, i) => (
                          <div key={`e-${i}`} className="cal-day empty" />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const d = i + 1
                          const date = new Date(calYear, calMonth, d)
                          const key = dateKey(date)
                          const isPast = date < today
                          const dow = date.getDay()
                          const isWeekend = dow === 0 || dow === 6
                          const blocked = isDateBlocked(date, blocks)
                          const isSelected = state.selectedDate === key

                          let cls = 'cal-day'
                          if (isPast || blocked) cls += ' past'
                          else if (isWeekend) cls += ' unavailable'
                          else cls += ' available'
                          if (isSelected) cls += ' selected'

                          const disabled = isPast || blocked || isWeekend
                          return (
                            <div
                              key={key}
                              className={cls}
                              onClick={() => {
                                if (disabled) return
                                setState((s) => ({ ...s, selectedDate: key, selectedTime: null }))
                                setSelectedUtcDate(null)
                              }}
                            >
                              {d}
                            </div>
                          )
                        })}
                      </div>

                      {state.selectedDate && slots.length > 0 && (
                        <div>
                          <div className="slots-label">Horaires disponibles : {slotsLabel}</div>
                          <div className="time-slots">
                            {slots.map((s) => {
                              const sel = state.selectedTime === s.time
                              const cls = `time-slot${sel ? ' selected' : ''}${!s.available ? ' unavailable' : ''}`
                              return (
                                <div
                                  key={`${s.utcDate}|${s.time}`}
                                  className={cls}
                                  onClick={() => {
                                    if (!s.available) return
                                    setSelectedUtcDate(s.utcDate)
                                    setState((st) => ({
                                      ...st,
                                      selectedTime: s.time,
                                    }))
                                  }}
                                >
                                  {s.localTime}
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                      {state.selectedDate && slots.length === 0 && (
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Aucun créneau ce jour-là.</p>
                      )}
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'rgba(255,255,255,0.4)',
                          textAlign: 'center',
                          marginTop: '0.75rem',
                        }}
                      >
                        🕐 Horaires affichés en heure locale ({visitorTz})
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* STEP 5 — Coordonnées */}
            <div className={`step${step === 5 ? ' active' : ''}`}>
              <div className="step-num">Étape 5 sur 5</div>
              <h2>Vos coordonnées.</h2>
              <p className="step-desc">Pour confirmer votre rendez-vous et vous envoyer les détails.</p>
              <div className="input-group">
                <div className="input-row">
                  <div className="input-field">
                    <label>Prénom</label>
                    <input type="text" value={state.contact.firstname} placeholder="Jean"
                      onChange={(e) => setState((s) => ({ ...s, contact: { ...s.contact, firstname: e.target.value } }))} />
                  </div>
                  <div className="input-field">
                    <label>Nom</label>
                    <input type="text" value={state.contact.lastname} placeholder="Dupont"
                      onChange={(e) => setState((s) => ({ ...s, contact: { ...s.contact, lastname: e.target.value } }))} />
                  </div>
                </div>
                <div className="input-field">
                  <label>Email professionnel</label>
                  <input type="email" value={state.contact.email} placeholder="jean@entreprise.com"
                    onChange={(e) => setState((s) => ({ ...s, contact: { ...s.contact, email: e.target.value } }))} />
                </div>
                <div className="input-field">
                  <label>Téléphone <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none' }}>(optionnel)</span></label>
                  <input type="tel" value={state.contact.phone} placeholder="+1 514 000 0000"
                    onChange={(e) => setState((s) => ({ ...s, contact: { ...s.contact, phone: e.target.value } }))} />
                </div>
                <div className="input-field">
                  <label>Entreprise <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400, textTransform: 'none' }}>(optionnel)</span></label>
                  <input type="text" value={state.contact.company} placeholder="Nom de votre entreprise"
                    onChange={(e) => setState((s) => ({ ...s, contact: { ...s.contact, company: e.target.value } }))} />
                </div>
                {submitError && <p style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '0.75rem' }}>{submitError}</p>}
              </div>
            </div>

            {/* STEP 6 — Confirmation */}
            <div className={`step${step === 6 ? ' active' : ''}`}>
              <div className="confirmation">
                <div className="check-circle">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2>Demande envoyée !</h2>
                <p>On a bien reçu votre demande. Nous la confirmerons dans les 24h et vous enverrons un email de confirmation.</p>
                <div className="recap-card">
                  <div className="recap-item">
                    <span>Service</span>
                    <span className="green">{state.service ? SERVICE_LABELS[state.service] : '-'}</span>
                  </div>
                  <div className="recap-item">
                    <span>Profil</span>
                    <span>{state.profile ? PROFILE_LABELS[state.profile] : '-'}</span>
                  </div>
                  <div className="recap-item">
                    <span>Créneau demandé</span>
                    <span>{recapDate()}</span>
                  </div>
                  <div className="recap-item">
                    <span>Contact</span>
                    <span>{`${state.contact.firstname} ${state.contact.lastname}`.trim() || '-'}</span>
                  </div>
                  <div className="recap-item">
                    <span>Email</span>
                    <span>{state.contact.email || '-'}</span>
                  </div>
                </div>
                <Link
                  href={homeHref}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.6)',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '50px',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                  }}
                >
                  ← Retour au site
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom Nav */}
          {showBottomNav && (
            <div className="bottom-nav">
              <button
                type="button"
                className={`btn-back${step === 1 ? ' hidden' : ''}`}
                onClick={handleBack}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Retour
              </button>
              <span className="step-hint">{STEP_HINTS[step - 1]}</span>
              <button
                type="button"
                className="btn-next"
                onClick={handleNext}
                disabled={!isStepValid() || submitting}
              >
                {submitting ? 'Envoi…' : step === TOTAL_STEPS ? 'Envoyer ma demande' : 'Continuer'}
                {!submitting && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    {step === TOTAL_STEPS ? (
                      <>
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </>
                    ) : (
                      <polyline points="9 18 15 12 9 6" />
                    )}
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
