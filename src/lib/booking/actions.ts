'use server'

import { createClient } from '@/lib/supabase/server'
import type {
  AvailabilityBlock,
  AvailabilityRule,
  BookingState,
  Reservation,
  Urgency,
} from '@/lib/types/booking'

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
  state: BookingState
): Promise<{ success: boolean; error?: string }> {
  const err = validateBooking(state)
  if (err) return { success: false, error: err }

  const supabase = await createClient()
  const slotDate = toIsoDate(state.selectedDate!)
  const slotTime = state.selectedTime!

  // Re-check slot is still free
  const { data: existing, error: checkErr } = await supabase
    .from('reservations')
    .select('id')
    .eq('slot_date', slotDate)
    .eq('slot_time', slotTime)
    .neq('status', 'cancelled')
    .limit(1)

  if (checkErr) return { success: false, error: checkErr.message }
  if (existing && existing.length > 0)
    return { success: false, error: 'Ce créneau vient d\'être pris.' }

  const contactName = `${state.contact.firstname} ${state.contact.lastname}`.trim()

  const { data: reservation, error: insErr } = await supabase
    .from('reservations')
    .insert({
      service: state.service,
      profile: state.profile,
      project_desc: state.projectDesc,
      contact_name: contactName,
      contact_email: state.contact.email,
      contact_phone: state.contact.phone || null,
      contact_company: state.contact.company || null,
      slot_date: slotDate,
      slot_time: slotTime,
      status: 'pending',
    })
    .select('id')
    .single()

  if (insErr || !reservation) {
    return { success: false, error: insErr?.message ?? 'Erreur insertion' }
  }

  await supabase.from('leads').insert({
    source: 'booking',
    service: state.service,
    profile: state.profile,
    contact_name: contactName,
    contact_email: state.contact.email,
    contact_phone: state.contact.phone || null,
    contact_company: state.contact.company || null,
    project_desc: state.projectDesc,
    status: 'new',
    reservation_id: reservation.id,
  })

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

  const { data: queue, error: qErr } = await supabase
    .from('queue_entries')
    .insert({
      service: data.service,
      profile: data.profile,
      project_desc: data.projectDesc,
      contact_name: contactName,
      contact_email: data.contact.email,
      contact_phone: data.contact.phone || null,
      urgency: data.urgency,
      status: 'waiting',
    })
    .select('id')
    .single()

  if (qErr || !queue) return { success: false, error: qErr?.message ?? 'Erreur file' }

  await supabase.from('leads').insert({
    source: 'queue',
    service: data.service,
    profile: data.profile,
    contact_name: contactName,
    contact_email: data.contact.email,
    contact_phone: data.contact.phone || null,
    contact_company: data.contact.company || null,
    project_desc: data.projectDesc,
    status: 'new',
    queue_id: queue.id,
  })

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
  const { data } = await supabase
    .from('reservations')
    .select('*')
    .eq('reschedule_token', token)
    .eq('status', 'cancelled')
    .single()

  if (!data) return { valid: false }
  if (!data.cancelled_at) return { valid: false }

  const cancelledAt = new Date(data.cancelled_at)
  const diffDays =
    (Date.now() - cancelledAt.getTime()) / (1000 * 60 * 60 * 24)
  if (diffDays > 7) return { valid: false, expired: true }

  return {
    valid: true,
    reservation: {
      id: data.id,
      service: data.service,
      profile: data.profile,
      project_desc: data.project_desc,
      contact_name: data.contact_name,
      contact_email: data.contact_email,
      contact_phone: data.contact_phone,
      contact_company: data.contact_company,
      slot_date: data.slot_date,
      slot_time: data.slot_time,
    },
  }
}

export async function confirmReschedule(
  token: string,
  newDate: string,
  newTime: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const rescheduleData = await getRescheduleData(token)
  if (!rescheduleData.valid) {
    return {
      success: false,
      error: rescheduleData.expired ? 'Token expiré' : 'Token invalide',
    }
  }

  const res = rescheduleData.reservation

  const { data: existing } = await supabase
    .from('reservations')
    .select('id')
    .eq('slot_date', newDate)
    .eq('slot_time', newTime)
    .neq('status', 'cancelled')
    .limit(1)

  if (existing && existing.length > 0) {
    return { success: false, error: 'Créneau déjà réservé' }
  }

  const { error: insErr } = await supabase.from('reservations').insert({
    service: res.service,
    profile: res.profile,
    project_desc: res.project_desc,
    contact_name: res.contact_name,
    contact_email: res.contact_email,
    contact_phone: res.contact_phone,
    contact_company: res.contact_company,
    slot_date: newDate,
    slot_time: newTime,
    status: 'pending',
  })

  if (insErr) return { success: false, error: insErr.message }

  await supabase
    .from('reservations')
    .update({ reschedule_token: null })
    .eq('reschedule_token', token)

  return { success: true }
}
