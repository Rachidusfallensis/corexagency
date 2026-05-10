'use client'

import Image from 'next/image'
import Link from 'next/link'
import { use, useEffect, useMemo, useState } from 'react'
import { useLocale } from 'next-intl'
import { LOGOS } from '@/lib/assets'
import {
  confirmReschedule,
  getAvailabilityData,
  getRescheduleData,
  type RescheduleData,
} from '@/lib/booking/actions'
import {
  dateKey,
  generateSlots,
  isDateBlocked,
} from '@/lib/booking/availability'
import type {
  AvailabilityBlock,
  AvailabilityRule,
  Reservation,
} from '@/lib/types/booking'

const PROTO_CSS = `
*{margin:0;padding:0;box-sizing:border-box}
.proto-resched,.proto-resched *{font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif}
.proto-resched{background:#050505;color:#fff;height:100vh;overflow:hidden}
.booking-wrap{display:grid;grid-template-columns:1fr 1fr;height:100vh}
.left-panel{background:#016B2D;display:flex;flex-direction:column;justify-content:space-between;padding:2.5rem;position:relative;overflow:hidden}
.left-panel::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 80% at 20% 80%,rgba(1,234,98,0.15),transparent 70%);pointer-events:none}
.left-panel::after{content:'';position:absolute;inset:0;background-image:radial-gradient(circle,rgba(255,255,255,0.06) 1px,transparent 1px);background-size:28px 28px;pointer-events:none}
.left-content{position:relative;z-index:1}
.left-content h1{font-size:clamp(1.8rem,3vw,2.6rem);font-weight:800;line-height:1.1;letter-spacing:-0.03em;margin-bottom:1rem}
.left-content h1 em{font-style:normal;color:#01EA62}
.left-content p{color:rgba(255,255,255,0.65);font-size:1rem;line-height:1.7;max-width:340px}
.left-bottom{position:relative;z-index:1}
.left-bottom p{font-size:0.78rem;color:rgba(255,255,255,0.4)}
.right-panel{background:#050505;display:flex;flex-direction:column;overflow-y:auto;padding:2.5rem;justify-content:center}
.right-panel h2{font-size:clamp(1.4rem,2.5vw,2rem);font-weight:700;line-height:1.2;letter-spacing:-0.02em;margin-bottom:0.6rem}
.right-panel .desc{font-size:0.9rem;color:rgba(255,255,255,0.5);margin-bottom:2rem}
.calendar-wrap{display:flex;flex-direction:column;gap:1.25rem}
.cal-header{display:flex;align-items:center;justify-content:space-between}
.cal-header h4{font-size:0.95rem;font-weight:600}
.cal-nav{display:flex;gap:0.5rem}
.cal-nav-btn{width:32px;height:32px;border-radius:8px;border:1.5px solid rgba(255,255,255,0.1);background:transparent;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center}
.cal-nav-btn:hover:not(:disabled){border-color:rgba(1,234,98,0.4);background:rgba(1,234,98,0.06)}
.cal-nav-btn:disabled{opacity:0.3;cursor:not-allowed}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.cal-day-label{font-size:0.68rem;font-weight:600;text-align:center;color:rgba(255,255,255,0.3);text-transform:uppercase;padding:0.3rem 0}
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
.btn-confirm{margin-top:1.5rem;background:#01EA62;color:#050505;padding:0.85rem 2rem;border-radius:50px;font-size:0.875rem;font-weight:700;cursor:pointer;border:none;transition:all 0.2s;width:100%;display:flex;align-items:center;justify-content:center;gap:8px}
.btn-confirm:disabled{background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.3);cursor:not-allowed}
.confirmation{text-align:center}
.check-circle{width:72px;height:72px;border-radius:50%;background:rgba(1,234,98,0.12);border:2px solid #01EA62;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)}
@keyframes popIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
.error-box{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);border-radius:14px;padding:2rem;text-align:center}
.error-box h2{color:#EF4444}
.btn-back{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.06);color:rgba(255,255,255,0.6);padding:0.75rem 1.5rem;border-radius:50px;text-decoration:none;font-size:0.875rem;font-weight:500;margin-top:1.5rem}
@media(max-width:768px){
  .booking-wrap{grid-template-columns:1fr}
  .left-panel{display:none}
  .proto-resched{height:auto;overflow:auto}
  .right-panel{padding:1.5rem;min-height:100vh}
  .time-slots{grid-template-columns:repeat(2,1fr)}
}
`

const MONTHS_FULL = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
const DAY_LABELS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
const DAY_NAMES = ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export default function ReschedulePage({
  params,
}: {
  params: Promise<{ locale: string; token: string }>
}) {
  const { token } = use(params)
  const locale = useLocale()
  const homeHref = `/${locale}`

  const [loaded, setLoaded] = useState(false)
  const [reschedule, setReschedule] = useState<RescheduleData>({ valid: false })
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])

  const today = useMemo(() => startOfDay(new Date()), [])
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([getRescheduleData(token), getAvailabilityData()]).then(
      ([resched, avail]) => {
        if (!active) return
        setReschedule(resched)
        setRules(avail.rules)
        setBlocks(avail.blocks)
        setReservations(avail.reservations)
        setLoaded(true)
      }
    )
    return () => {
      active = false
    }
  }, [token])

  const minMonthAbs = today.getFullYear() * 12 + today.getMonth()
  const maxMonthAbs = minMonthAbs + 2
  const curAbs = calYear * 12 + calMonth

  function changeMonth(delta: number) {
    const next = curAbs + delta
    if (next < minMonthAbs || next > maxMonthAbs) return
    setCalYear(Math.floor(next / 12))
    setCalMonth(next % 12)
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const firstDow = new Date(calYear, calMonth, 1).getDay()
  const offset = firstDow === 0 ? 6 : firstDow - 1
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()

  const selDateObj = selectedDate
    ? (() => {
        const [y, m, d] = selectedDate.split('-').map(Number)
        return new Date(y, m - 1, d)
      })()
    : null
  const slots = selDateObj ? generateSlots(selDateObj, rules, reservations, blocks) : []
  const slotsLabel = selDateObj
    ? `${DAY_NAMES[selDateObj.getDay()]} ${selDateObj.getDate()} ${MONTHS_FULL[selDateObj.getMonth()].toLowerCase()}`
    : ''

  function isoDate(key: string) {
    const [y, m, d] = key.split('-')
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return
    setSubmitting(true)
    setError(null)
    const res = await confirmReschedule(token, isoDate(selectedDate), selectedTime)
    setSubmitting(false)
    if (res.success) setDone(true)
    else setError(res.error ?? 'Erreur')
  }

  return (
    <div className="proto-resched">
      <style dangerouslySetInnerHTML={{ __html: PROTO_CSS }} />
      <div className="booking-wrap">
        {/* LEFT */}
        <div className="left-panel">
          <Link href={homeHref} style={{ textDecoration: 'none', display: 'inline-flex', position: 'relative', zIndex: 1 }}>
            <Image src={LOGOS.blanc} alt="Corex" width={110} height={37} priority />
          </Link>

          <div className="left-content">
            <h1>
              Choisissez un<br />
              nouveau <em>créneau.</em>
            </h1>
            <p>Votre rendez-vous précédent a été annulé. Sélectionnez la date et l&apos;heure qui vous conviennent.</p>
          </div>

          <div className="left-bottom">
            <p>© 2026 Corex — Your tech partner, from day one.</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="right-panel">
          {!loaded ? (
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Chargement…</p>
          ) : !reschedule.valid ? (
            <div className="error-box">
              <h2>{reschedule.expired ? 'Lien expiré' : 'Lien invalide'}</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.75rem' }}>
                {reschedule.expired
                  ? "Ce lien de replanification a dépassé sa durée de validité (7 jours)."
                  : "Ce lien n'est pas valide ou a déjà été utilisé."}
              </p>
              <Link href={`${homeHref}/rendez-vous`} className="btn-back">
                Prendre un nouveau RV →
              </Link>
            </div>
          ) : done ? (
            <div className="confirmation">
              <div className="check-circle">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#01EA62" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2>Nouveau créneau réservé !</h2>
              <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '360px', margin: '0.75rem auto 0' }}>
                Votre nouvelle demande est en attente de confirmation. Nous reviendrons vers vous dans les 24h.
              </p>
              <Link href={homeHref} className="btn-back">
                ← Retour au site
              </Link>
            </div>
          ) : (
            <>
              <h2>Choisissez votre nouveau créneau.</h2>
              <p className="desc">
                Bonjour {reschedule.reservation.contact_name}, sélectionnez une date et un horaire ci-dessous.
              </p>
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
                    const k = dateKey(date)
                    const isPast = date < today
                    const dow = date.getDay()
                    const isWeekend = dow === 0 || dow === 6
                    const blocked = isDateBlocked(date, blocks)
                    const isSelected = selectedDate === k

                    let cls = 'cal-day'
                    if (isPast || blocked) cls += ' past'
                    else if (isWeekend) cls += ' unavailable'
                    else cls += ' available'
                    if (isSelected) cls += ' selected'

                    const disabled = isPast || blocked || isWeekend
                    return (
                      <div
                        key={k}
                        className={cls}
                        onClick={() => {
                          if (disabled) return
                          setSelectedDate(k)
                          setSelectedTime(null)
                        }}
                      >
                        {d}
                      </div>
                    )
                  })}
                </div>
                {selectedDate && slots.length > 0 && (
                  <div>
                    <div className="slots-label">Horaires disponibles — {slotsLabel}</div>
                    <div className="time-slots">
                      {slots.map((s) => {
                        const sel = selectedTime === s.time
                        const cls = `time-slot${sel ? ' selected' : ''}${!s.available ? ' unavailable' : ''}`
                        return (
                          <div
                            key={s.time}
                            className={cls}
                            onClick={() => {
                              if (!s.available) return
                              setSelectedTime(s.time)
                            }}
                          >
                            {s.time}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                {selectedDate && slots.length === 0 && (
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>
                    Aucun créneau ce jour-là.
                  </p>
                )}
              </div>

              {error && <p style={{ color: '#EF4444', fontSize: '0.85rem', marginTop: '1rem' }}>{error}</p>}

              <button
                type="button"
                className="btn-confirm"
                disabled={!selectedDate || !selectedTime || submitting}
                onClick={handleConfirm}
              >
                {submitting ? 'Envoi…' : 'Confirmer ce créneau'} →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
