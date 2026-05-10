export type Service = 'digitalisation' | 'saas' | 'other'
export type Profile = 'startup' | 'pme' | 'freelance' | 'other'
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'
export type Urgency = 'high' | 'medium' | 'low'

export interface BookingState {
  service: Service | null
  profile: Profile | null
  projectDesc: string
  selectedDate: string | null // 'YYYY-M-D'
  selectedTime: string | null // 'HH:MM'
  contact: {
    firstname: string
    lastname: string
    email: string
    phone: string
    company: string
  }
}

export interface TimeSlot {
  /** UTC HH:MM — what gets stored in DB */
  time: string
  /** Visitor wall-clock HH:MM — what gets displayed */
  localTime: string
  /** UTC date (YYYY-MM-DD) — used for DB persistence + conflict check */
  utcDate: string
  available: boolean
  /** Visitor (or admin) timezone label this slot is presented in */
  timezone: string
}

export interface AvailabilityRule {
  id: string
  days_of_week: number[]
  start_time: string
  end_time: string
  slot_duration: number
  valid_from: string | null
  valid_until: string | null
  timezone?: string | null
}

export const TIMEZONES = [
  {
    value: 'America/Toronto',
    label: 'Montréal / Toronto',
    flag: '🌎',
    offset: 'UTC-5/UTC-4',
  },
  {
    value: 'Africa/Dakar',
    label: 'Dakar',
    flag: '🌍',
    offset: 'UTC+0/UTC+1',
  },
  {
    value: 'Europe/Paris',
    label: 'Paris',
    flag: '🇫🇷',
    offset: 'UTC+1/UTC+2',
  },
  {
    value: 'UTC',
    label: 'UTC',
    flag: '🌐',
    offset: 'UTC+0',
  },
] as const

export type TimezoneValue = (typeof TIMEZONES)[number]['value']

export interface AvailabilityBlock {
  id: string
  start_date: string
  end_date: string
}

export interface Reservation {
  slot_date: string
  slot_time: string
  status: BookingStatus
}

export const EMPTY_BOOKING_STATE: BookingState = {
  service: null,
  profile: null,
  projectDesc: '',
  selectedDate: null,
  selectedTime: null,
  contact: {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    company: '',
  },
}
