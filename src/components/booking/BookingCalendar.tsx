'use client'

import { useMemo, useState } from 'react'
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

type BookingCalendarProps = {
  rules: AvailabilityRule[]
  reservations: Reservation[]
  blocks: AvailabilityBlock[]
  selectedDate: string | null
  selectedTime: string | null
  onDateSelect: (date: string) => void
  onTimeSelect: (time: string) => void
}

const MONTHS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
]
const DAYS = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const DAY_NAMES = [
  'Dimanche',
  'Lundi',
  'Mardi',
  'Mercredi',
  'Jeudi',
  'Vendredi',
  'Samedi',
]

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export default function BookingCalendar({
  rules,
  reservations,
  blocks,
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: BookingCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const minMonth = today.getMonth()
  const minYear = today.getFullYear()
  const maxAbs = minYear * 12 + minMonth + 2 // current + 2 months ahead
  const curAbs = year * 12 + month

  function changeMonth(delta: number) {
    const next = curAbs + delta
    if (next < minYear * 12 + minMonth) return
    if (next > maxAbs) return
    const ny = Math.floor(next / 12)
    const nm = next % 12
    setYear(ny)
    setMonth(nm)
  }

  const firstDow = new Date(year, month, 1).getDay()
  const offset = firstDow === 0 ? 6 : firstDow - 1
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: Array<{ kind: 'empty' } | { kind: 'day'; day: number; date: Date; key: string }> = []
  for (let i = 0; i < offset; i++) cells.push({ kind: 'empty' })
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    cells.push({ kind: 'day', day: d, date, key: dateKey(date) })
  }

  const selDateObj = selectedDate
    ? (() => {
        const [y, m, d] = selectedDate.split('-').map(Number)
        return new Date(y, m - 1, d)
      })()
    : null

  const slots =
    selDateObj && dateKey(selDateObj) === selectedDate
      ? generateSlots(selDateObj, rules, reservations, blocks)
      : []

  const slotsLabel = selDateObj
    ? `${DAY_NAMES[selDateObj.getDay()]} ${selDateObj.getDate()} ${MONTHS[selDateObj.getMonth()].toLowerCase()}`
    : ''

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h4 className="text-[0.95rem] font-semibold text-white">
          {MONTHS[month]} {year}
        </h4>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            disabled={curAbs <= minYear * 12 + minMonth}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-green-vivid/[0.06] enabled:hover:border-green-vivid/40"
            style={{ border: '1.5px solid rgba(255,255,255,0.1)' }}
            aria-label="Mois précédent"
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            disabled={curAbs >= maxAbs}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-green-vivid/[0.06] enabled:hover:border-green-vivid/40"
            style={{ border: '1.5px solid rgba(255,255,255,0.1)' }}
            aria-label="Mois suivant"
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-[0.68rem] font-bold text-center uppercase tracking-wide py-1"
            style={{ color: 'rgba(255,255,255,0.3)' }}
          >
            {d}
          </div>
        ))}

        {cells.map((cell, i) => {
          if (cell.kind === 'empty') {
            return <div key={`e-${i}`} className="aspect-square" />
          }
          const { day, date, key } = cell
          const isPast = date < today
          const isWeekend = date.getDay() === 0 || date.getDay() === 6
          const blocked = isDateBlocked(date, blocks)
          const isSelected = selectedDate === key

          let className = 'aspect-square rounded-lg flex items-center justify-center text-[0.8rem] transition-all'
          let style: React.CSSProperties = { border: '1.5px solid transparent' }
          let disabled = false

          if (isPast || blocked) {
            className += ' cursor-not-allowed'
            style = { ...style, color: 'rgba(255,255,255,0.15)' }
            disabled = true
          } else if (isWeekend) {
            className += ' cursor-not-allowed line-through'
            style = { ...style, color: 'rgba(255,255,255,0.15)' }
            disabled = true
          } else if (isSelected) {
            className += ' font-bold'
            style = {
              background: 'rgba(1,234,98,0.15)',
              borderColor: '#01EA62',
              color: '#01EA62',
            }
          } else {
            className += ' cursor-pointer hover:bg-green-vivid/10 hover:border-green-vivid/30 hover:text-white'
            style = { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.7)' }
          }

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => onDateSelect(key)}
              className={className}
              style={style}
            >
              {day}
            </button>
          )
        })}
      </div>

      {selectedDate && slots.length > 0 ? (
        <div>
          <div
            className="text-[0.75rem] mb-2 font-medium"
            style={{ color: 'rgba(255,255,255,0.35)' }}
          >
            Horaires disponibles — {slotsLabel}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {slots.map((s) => {
              const isSelected = selectedTime === s.time
              const className = `px-2 py-2.5 rounded-[10px] text-[0.8rem] text-center transition-all ${
                s.available ? 'cursor-pointer' : 'cursor-not-allowed line-through'
              }`
              const baseStyle: React.CSSProperties = {
                border: isSelected
                  ? '1.5px solid #01EA62'
                  : '1.5px solid rgba(255,255,255,0.1)',
                background: isSelected
                  ? 'rgba(1,234,98,0.12)'
                  : 'rgba(255,255,255,0.03)',
                color: isSelected ? '#01EA62' : 'rgba(255,255,255,0.7)',
                fontWeight: isSelected ? 600 : 500,
                opacity: s.available ? 1 : 0.25,
              }
              return (
                <button
                  key={s.time}
                  type="button"
                  disabled={!s.available}
                  onClick={() => onTimeSelect(s.time)}
                  className={className}
                  style={baseStyle}
                >
                  {s.time}
                </button>
              )
            })}
          </div>
        </div>
      ) : selectedDate ? (
        <p
          className="text-[0.78rem] mt-1"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          Aucun créneau ce jour-là.
        </p>
      ) : null}
    </div>
  )
}
