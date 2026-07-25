'use server'

import { createClient } from '@/lib/supabase/server'
import type {
  AvailabilityBlock,
  AvailabilityRule,
  BookingState,
  Reservation,
  Urgency,
} from '@/lib/types/booking'

async function hashToken(token: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function getAvailabilityData(): Promise<{
  rules: AvailabilityRule[]
  blocks: AvailabilityBlock[]
  reservations: Reservation[]
}> {
  const supabase = await createClient()
  const [rulesRes, blocksRes, resRes] = await Promise.all([
    supabase.from('availability_rules').select('*'),
    supabase.from('availability_blocks').select('*'),
    supabase
      .from('reservations')
      .select('slot_date, slot_time, status')
      .neq('status', 'cancelled'),
  ])

  return {
    rules: (rulesRes.data ?? []) as AvailabilityRule[],
    blocks: (blocksRes.data ?? []) as AvailabilityBlock[],
    reservations: (resRes.data ?? []) as Reservation[],
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateBooking(state: BookingState): string | null {
  if (!state.service) return 'Service requis'
  if (!state.profile) return 'Profil requis'
  if (!state.projectDesc || state.projectDesc.trim().length < 20)
    return 'Description trop courte (min 20 caractères)'
  if (!state.selectedDate || !state.selectedTime) return 'Créneau requis'
  if (!state.contact.firstname.trim() || !state.contact.lastname.trim())
    return 'Nom et prénom requis'
  if (!EMAIL_RE.test(state.contact.email)) return 'Email invalide'
  return null
}

function toIsoDate(key: string): string {
  // 'YYYY-M-D' → 'YYYY-MM-DD'
  const [y, m, d] = key.split('-')
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
}

export async function createReservation(
  state: BookingState,
  visitorTimezone?: string
): Promise<{ success: boolean; error?: string }> {
  const err = validateBooking(state)
  if (err) return { success: false, error: err }

  const supabase = await createClient()
  const slotDate = toIsoDate(state.selectedDate!)
  const slotTime = state.selectedTime!
  const contactName = `${state.contact.firstname} ${state.contact.lastname}`.trim()

  const payload = {
    service: state.service,
    profile: state.profile,
    projectDesc: state.projectDesc,
    contactName,
    contactEmail: state.contact.email,
    contactPhone: state.contact.phone || null,
    contactCompany: state.contact.company || null,
    slotDate,
    slotTime,
    visitorTimezone: visitorTimezone ?? null,
  }

  const { error: rpcErr } = await supabase.rpc('create_reservation', {
    payload,
  })

  if (rpcErr) {
    if (rpcErr.message.includes('SLOT_TAKEN') || rpcErr.code === 'P0001') {
      return { success: false, error: 'Ce créneau vient d\'être pris.' }
    }
    return { success: false, error: rpcErr.message }
  }

  return { success: true }
}

export async function createQueueEntry(data: {
  service: string
  profile: string
  projectDesc: string
  contact: BookingState['contact']
  urgency: Urgency
}): Promise<{ success: boolean; error?: string }> {
  if (!data.service) return { success: false, error: 'Service requis' }
  if (!data.profile) return { success: false, error: 'Profil requis' }
  if (data.projectDesc.trim().length < 20)
    return { success: false, error: 'Description trop courte' }
  if (!data.contact.firstname.trim() || !data.contact.lastname.trim())
    return { success: false, error: 'Nom et prénom requis' }
  if (!EMAIL_RE.test(data.contact.email))
    return { success: false, error: 'Email invalide' }

  const supabase = await createClient()
  const contactName = `${data.contact.firstname} ${data.contact.lastname}`.trim()

  const payload = {
    service: data.service,
    profile: data.profile,
    projectDesc: data.projectDesc,
    contactName,
    contactEmail: data.contact.email,
    contactPhone: data.contact.phone || null,
    contactCompany: data.contact.company || null,
    urgency: data.urgency,
  }

  const { error: rpcErr } = await supabase.rpc('create_queue_entry', {
    payload,
  })

  if (rpcErr) {
    return { success: false, error: rpcErr.message }
  }

  return { success: true }
}

export type RescheduleData =
  | { valid: false; expired?: boolean }
  | {
      valid: true
      reservation: {
        id: string
        service: string
        profile: string
        project_desc: string
        contact_name: string
        contact_email: string
        contact_phone: string | null
        contact_company: string | null
        slot_date: string
        slot_time: string
      }
    }

export async function getRescheduleData(token: string): Promise<RescheduleData> {
  const supabase = await createClient()
  const hashed = await hashToken(token)

  const { data, error } = await supabase
    .rpc('check_reschedule_token', { p_token_hash: hashed })
    .single()

  if (error || !data) return { valid: false }

  const resData = data as any

  if (!resData.valid) {
    if (resData.expired) return { valid: false, expired: true }
    return { valid: false }
  }

  return {
    valid: true,
    reservation: {
      id: resData.reservation_id,
      service: resData.service,
      profile: resData.profile,
      project_desc: resData.project_desc,
      contact_name: resData.contact_name,
      contact_email: resData.contact_email,
      contact_phone: resData.contact_phone,
      contact_company: resData.contact_company,
      slot_date: resData.slot_date,
      slot_time: resData.slot_time,
    },
  }
}

export async function confirmReschedule(
  token: string,
  newDate: string,
  newTime: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const hashed = await hashToken(token)

  const { error: rpcErr } = await supabase.rpc('create_rescheduled_reservation', {
    p_token_hash: hashed,
    p_slot_date: newDate,
    p_slot_time: newTime,
  })

  if (rpcErr) {
    if (rpcErr.message.includes('INVALID_TOKEN')) {
      return { success: false, error: 'Token invalide ou expiré' }
    }
    if (rpcErr.message.includes('SLOT_TAKEN') || rpcErr.code === 'P0001') {
      return { success: false, error: 'Créneau déjà réservé' }
    }
    return { success: false, error: rpcErr.message }
  }

  return { success: true }
}
