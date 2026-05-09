export interface ReservationRow {
  id: string
  created_at: string
  service: string
  profile: string
  project_desc: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  contact_company: string | null
  slot_date: string
  slot_time: string
  status: 'pending' | 'confirmed' | 'cancelled'
  admin_note: string | null
  reschedule_token: string | null
  confirmed_at: string | null
  cancelled_at: string | null
}

export interface QueueRow {
  id: string
  created_at: string
  service: string
  profile: string
  project_desc: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  urgency: 'high' | 'medium' | 'low'
  status: 'waiting' | 'invited' | 'converted' | 'rejected'
  invite_token: string | null
  invite_sent_at: string | null
}

export interface LeadRow {
  id: string
  created_at: string
  source: 'booking' | 'queue' | 'contact'
  service: string
  profile: string
  contact_name: string
  contact_email: string
  contact_phone: string | null
  contact_company: string | null
  project_desc: string
  status: string
}

export interface AvailabilityRuleRow {
  id: string
  days_of_week: number[]
  start_time: string
  end_time: string
  slot_duration: number
  valid_from: string | null
  valid_until: string | null
  created_at: string
}

export interface AvailabilityBlockRow {
  id: string
  start_date: string
  end_date: string
  reason: string | null
  created_at: string
}

export interface StatsData {
  pending: number
  confirmed: number
  queue: number
  leads: number
}
