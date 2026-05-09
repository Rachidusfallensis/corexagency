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
  time: string
  available: boolean
}

export interface AvailabilityRule {
  id: string
  days_of_week: number[]
  start_time: string
  end_time: string
  slot_duration: number
  valid_from: string | null
  valid_until: string | null
}

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
