import type {
  AvailabilityBlock,
  AvailabilityRule,
  Reservation,
  TimeSlot,
} from '@/lib/types/booking'
import { localTimeToUTC, utcToLocalTime } from '@/lib/timezone'

const DEFAULT_RULE_TZ = 'America/Toronto'

// JS getDay() returns 0=Sun..6=Sat. We store days as 0=Mon..6=Sun.
function jsDayToBusinessDay(jsDay: number): number {
  return (jsDay + 6) % 7
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function dateKeyPadded(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Parse 'YYYY-MM-DD' as a LOCAL date — avoids UTC parsing of `new Date(s)`
// which would shift the day in timezones west of UTC.
export function parseISODate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

function parseTime(t: string): { h: number; m: number } {
  const [h, m] = t.split(':').map((n) => parseInt(n, 10))
  return { h, m: m || 0 }
}

function fmtTime(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function inRange(date: Date, from: string | null, until: string | null): boolean {
  const ts = startOfDay(date).getTime()
  if (from && startOfDay(parseISODate(from)).getTime() > ts) return false
  if (until && startOfDay(parseISODate(until)).getTime() < ts) return false
  return true
}

export function isDateBlocked(date: Date, blocks: AvailabilityBlock[]): boolean {
  const ts = startOfDay(date).getTime()
  return blocks.some((b) => {
    const start = startOfDay(parseISODate(b.start_date)).getTime()
    const end = startOfDay(parseISODate(b.end_date)).getTime()
    return ts >= start && ts <= end
  })
}

/**
 * Generates time slots for a given date.
 *
 * - Each rule defines wall-clock times in `rule.timezone` (default: America/Toronto)
 * - Slots are converted to UTC for DB storage (`slot.time`, `slot.utcDate`)
 * - If `visitorTimezone` is provided, slots are also converted to visitor wall-clock for display (`slot.localTime`)
 * - Otherwise `localTime` falls back to the UTC time
 * - Slots whose UTC equivalent matches an active reservation are marked unavailable
 */
export function generateSlots(
  date: Date,
  rules: AvailabilityRule[],
  reservations: Reservation[],
  blocks: AvailabilityBlock[],
  visitorTimezone?: string
): TimeSlot[] {
  if (isDateBlocked(date, blocks)) return []

  const businessDay = jsDayToBusinessDay(date.getDay())
  // Weekends are always unavailable per CDC §10.2
  if (businessDay > 4) return []

  const applicable = rules.filter(
    (r) => r.days_of_week.includes(businessDay) && inRange(date, r.valid_from, r.valid_until)
  )
  if (applicable.length === 0) return []

  // Booked set: keyed by `${utc_date}|${utc_time_HHMM}`
  const bookedKeys = new Set(
    reservations
      .filter((r) => r.status !== 'cancelled')
      .map((r) => `${r.slot_date.slice(0, 10)}|${r.slot_time.slice(0, 5)}`)
  )

  const ruleDateStr = dateKeyPadded(date)
  const slots: TimeSlot[] = []
  const seenKey = new Set<string>()

  for (const rule of applicable) {
    const ruleTz = rule.timezone ?? DEFAULT_RULE_TZ
    const tzForDisplay = visitorTimezone ?? ruleTz

    const { h: sh, m: sm } = parseTime(rule.start_time)
    const { h: eh, m: em } = parseTime(rule.end_time)
    const startMin = sh * 60 + sm
    const endMin = eh * 60 + em
    const dur = rule.slot_duration

    for (let t = startMin; t + dur <= endMin; t += dur) {
      const wall = fmtTime(Math.floor(t / 60), t % 60)
      // Convert wall-clock-in-rule-tz on ruleDateStr to UTC
      const { utcDate, utcTime } = localTimeToUTC(ruleDateStr, wall, ruleTz)

      const dedupe = `${utcDate}|${utcTime}`
      if (seenKey.has(dedupe)) continue
      seenKey.add(dedupe)

      // Convert UTC back to display tz for visitor
      let localTime = utcTime
      let localDate = utcDate
      if (tzForDisplay !== 'UTC') {
        const v = utcToLocalTime(utcDate, utcTime, tzForDisplay)
        localTime = v.localTime
        localDate = v.localDate
      }

      // Only include slots that fall on `date` in the display timezone
      if (localDate !== ruleDateStr) continue

      const available = !bookedKeys.has(`${utcDate}|${utcTime}`)

      slots.push({
        time: utcTime,
        localTime,
        utcDate,
        available,
        timezone: tzForDisplay,
      })
    }
  }

  return slots.sort((a, b) => a.localTime.localeCompare(b.localTime))
}

export function hasAvailableSlots(
  date: Date,
  rules: AvailabilityRule[],
  reservations: Reservation[],
  blocks: AvailabilityBlock[]
): boolean {
  return generateSlots(date, rules, reservations, blocks).some((s) => s.available)
}

export function hasAnySlotInNext30Days(
  rules: AvailabilityRule[],
  reservations: Reservation[],
  blocks: AvailabilityBlock[]
): boolean {
  const today = startOfDay(new Date())
  for (let i = 0; i < 30; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    if (hasAvailableSlots(d, rules, reservations, blocks)) return true
  }
  return false
}

export { dateKey }
