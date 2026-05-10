/**
 * Returns the offset (in minutes) of a given UTC instant in the target timezone.
 * E.g. for America/Toronto in summer (EDT) returns -240 (UTC-4).
 */
function tzOffsetMinutes(date: Date, timezone: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = Object.fromEntries(
    dtf.formatToParts(date).map((p) => [p.type, p.value])
  )
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  )
  return Math.round((asUTC - date.getTime()) / 60000)
}

/**
 * Convert a wall-clock local time in a source timezone to UTC ISO date+time strings.
 */
export function localTimeToUTC(
  date: string, // 'YYYY-MM-DD'
  time: string, // 'HH:MM'
  timezone: string
): { utcDate: string; utcTime: string } {
  const [y, m, d] = date.split('-').map(Number)
  const [hh, mm] = time.split(':').map(Number)
  const asIfUTC = Date.UTC(y, m - 1, d, hh, mm, 0)
  // Find offset for that wall-clock moment in the source timezone
  const offsetMin = tzOffsetMinutes(new Date(asIfUTC), timezone)
  const utcMs = asIfUTC - offsetMin * 60000
  const utc = new Date(utcMs)
  const iso = utc.toISOString()
  return { utcDate: iso.slice(0, 10), utcTime: iso.slice(11, 16) }
}

/**
 * Convert a UTC date+time to a target timezone wall-clock representation.
 */
export function utcToLocalTime(
  utcDate: string,
  utcTime: string,
  targetTimezone: string
): { localDate: string; localTime: string; label: string } {
  const utcDateTime = new Date(`${utcDate}T${utcTime}:00Z`)

  const localTime = utcDateTime.toLocaleTimeString('fr-FR', {
    timeZone: targetTimezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  // Build YYYY-MM-DD safely via en-CA which formats as YYYY-MM-DD
  const localDate = utcDateTime
    .toLocaleDateString('en-CA', { timeZone: targetTimezone })
    .replace(/\//g, '-')

  let label = targetTimezone
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      timeZoneName: 'short',
    }).formatToParts(utcDateTime)
    const tzPart = parts.find((p) => p.type === 'timeZoneName')
    if (tzPart) label = tzPart.value
  } catch {
    /* keep targetTimezone as label */
  }

  return { localDate, localTime, label }
}

/**
 * Detects the visitor's IANA timezone (defaults to UTC if unavailable).
 */
export function getVisitorTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/**
 * Format a slot for visitor display: "10:00 (EDT)"
 */
export function formatSlotForVisitor(
  utcDate: string,
  utcTime: string,
  visitorTimezone: string
): string {
  const { localTime, label } = utcToLocalTime(utcDate, utcTime, visitorTimezone)
  return `${localTime} (${label})`
}
