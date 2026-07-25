'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import type {
  AvailabilityBlockRow,
  AvailabilityRuleRow,
  LeadRow,
  QueueRow,
  ReservationRow,
  StatsData,
} from '@/lib/types/admin'
import { generateSlots, parseISODate } from '@/lib/booking/availability'

function generateToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hashToken(token: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(token)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  return user
}

type ActionResult = { success: boolean; error?: string; conflicts?: ReservationRow[] }

export async function getStats(): Promise<StatsData> {
  await requireAdmin()
  const svc = createServiceClient()
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const [pending, confirmed, queue, leads] = await Promise.all([
    svc.from('reservations').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    svc
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'confirmed')
      .gte('confirmed_at', monthStart.toISOString()),
    svc.from('queue_entries').select('*', { count: 'exact', head: true }).eq('status', 'waiting'),
    svc.from('leads').select('*', { count: 'exact', head: true }),
  ])

  return {
    pending: pending.count ?? 0,
    confirmed: confirmed.count ?? 0,
    queue: queue.count ?? 0,
    leads: leads.count ?? 0,
  }
}

export async function getReservations(filters?: {
  status?: string
  service?: string
  page?: number
  limit?: number
}): Promise<{ data: ReservationRow[]; total: number }> {
  await requireAdmin()
  const svc = createServiceClient()
  let q = svc.from('reservations').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  if (filters?.status && filters.status !== 'all') q = q.eq('status', filters.status)
  if (filters?.service && filters.service !== 'all') q = q.eq('service', filters.service)
  
  if (filters?.page && filters?.limit) {
    const from = (filters.page - 1) * filters.limit
    q = q.range(from, from + filters.limit - 1)
  }

  const { data, count } = await q
  return { data: (data ?? []) as ReservationRow[], total: count ?? 0 }
}

export async function confirmReservation(id: string): Promise<ActionResult> {
  await requireAdmin()
  const svc = createServiceClient()
  const { error } = await svc
    .from('reservations')
    .update({ status: 'confirmed', confirmed_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/admin', 'layout')
  return { success: true }
}

export async function cancelReservation(
  id: string,
  reason: string,
  withReschedule: boolean
): Promise<ActionResult> {
  await requireAdmin()
  if (!reason.trim()) return { success: false, error: 'Motif requis' }
  const svc = createServiceClient()
  const update: Record<string, unknown> = {
    status: 'cancelled',
    cancelled_at: new Date().toISOString(),
    admin_note: reason,
  }

  const { error } = await svc.from('reservations').update(update).eq('id', id)
  if (error) return { success: false, error: error.message }

  if (withReschedule) {
    const plainToken = generateToken()
    const hashed = await hashToken(plainToken)

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)

    const { error: tokenErr } = await svc.from('reschedule_tokens').insert({
      token_hash: hashed,
      reservation_id: id,
      expires_at: expiresAt.toISOString(),
    })

    if (tokenErr) {
      console.error('Erreur insertion token:', tokenErr)
    } else {
      console.log('\n--- EMAIL SIMULATION ---')
      console.log(`Lien de replanification pour ${id}:`)
      console.log(`http://localhost:3000/rendez-vous/replanifier/${plainToken}`)
      console.log('------------------------\n')
    }
  }

  revalidatePath('/[locale]/admin', 'layout')
  return { success: true }
}

export async function getQueue(): Promise<QueueRow[]> {
  await requireAdmin()
  const svc = createServiceClient()
  const { data } = await svc
    .from('queue_entries')
    .select('*')
    .order('created_at', { ascending: true })
  return (data ?? []) as QueueRow[]
}

export async function inviteFromQueue(id: string): Promise<ActionResult> {
  await requireAdmin()
  const svc = createServiceClient()
  const { error } = await svc
    .from('queue_entries')
    .update({
      status: 'invited',
      invite_token: crypto.randomUUID(),
      invite_sent_at: new Date().toISOString(),
    })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/admin', 'layout')
  return { success: true }
}

export async function rejectFromQueue(id: string): Promise<ActionResult> {
  await requireAdmin()
  const svc = createServiceClient()
  const { error } = await svc
    .from('queue_entries')
    .update({ status: 'rejected' })
    .eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/admin', 'layout')
  return { success: true }
}

export async function getLeads(filters?: {
  service?: string
  source?: string
  page?: number
  limit?: number
}): Promise<{ data: LeadRow[]; total: number }> {
  await requireAdmin()
  const svc = createServiceClient()
  let q = svc.from('leads').select('*', { count: 'exact' }).order('created_at', { ascending: false })
  if (filters?.service && filters.service !== 'all') q = q.eq('service', filters.service)
  if (filters?.source && filters.source !== 'all') q = q.eq('source', filters.source)

  if (filters?.page && filters?.limit) {
    const from = (filters.page - 1) * filters.limit
    q = q.range(from, from + filters.limit - 1)
  }

  const { data, count } = await q
  return { data: (data ?? []) as LeadRow[], total: count ?? 0 }
}

export async function getAvailabilityRules(): Promise<AvailabilityRuleRow[]> {
  await requireAdmin()
  const svc = createServiceClient()
  const { data } = await svc
    .from('availability_rules')
    .select('*')
    .order('created_at', { ascending: false })
  return (data ?? []) as AvailabilityRuleRow[]
}

export async function addAvailabilityRule(rule: {
  days_of_week: number[]
  start_time: string
  end_time: string
  slot_duration: number
  timezone?: string
}): Promise<ActionResult> {
  await requireAdmin()
  if (rule.days_of_week.length === 0) return { success: false, error: 'Sélectionnez au moins un jour' }
  const svc = createServiceClient()
  const { error } = await svc.from('availability_rules').insert({
    ...rule,
    timezone: rule.timezone ?? 'America/Toronto',
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/admin', 'layout')
  return { success: true }
}

export async function deleteAvailabilityRule(id: string, force?: boolean): Promise<ActionResult> {
  await requireAdmin()
  const svc = createServiceClient()

  if (!force) {
    const { data: rules } = await svc.from('availability_rules').select('*').neq('id', id)
    const { data: blocks } = await svc.from('availability_blocks').select('*')
    const todayStr = new Date().toISOString().slice(0, 10)
    const { data: activeRes } = await svc
      .from('reservations')
      .select('*')
      .in('status', ['pending', 'confirmed'])
      .gte('slot_date', todayStr)
      
    const conflicts: ReservationRow[] = []
    if (activeRes && rules && blocks) {
      for (const res of activeRes) {
        const slots = generateSlots(
          parseISODate(res.slot_date.slice(0, 10)),
          rules as any[],
          [],
          blocks as any[]
        )
        const slotExists = slots.some(s => s.time === res.slot_time.slice(0, 5))
        if (!slotExists) {
          conflicts.push(res as ReservationRow)
        }
      }
    }
    
    if (conflicts.length > 0) {
      return { success: false, conflicts }
    }
  }

  const { error } = await svc.from('availability_rules').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/admin', 'layout')
  return { success: true }
}

export async function getAvailabilityBlocks(): Promise<AvailabilityBlockRow[]> {
  await requireAdmin()
  const svc = createServiceClient()
  const { data } = await svc
    .from('availability_blocks')
    .select('*')
    .order('start_date', { ascending: true })
  return (data ?? []) as AvailabilityBlockRow[]
}

export async function addAvailabilityBlock(
  block: { start_date: string; end_date: string; reason?: string },
  force?: boolean
): Promise<ActionResult> {
  await requireAdmin()
  const svc = createServiceClient()

  if (!force) {
    const { data: conflicts } = await svc
      .from('reservations')
      .select('*')
      .in('status', ['pending', 'confirmed'])
      .gte('slot_date', block.start_date)
      .lte('slot_date', block.end_date)
      
    if (conflicts && conflicts.length > 0) {
      return { success: false, conflicts: conflicts as ReservationRow[] }
    }
  }

  const { error } = await svc.from('availability_blocks').insert({
    start_date: block.start_date,
    end_date: block.end_date,
    reason: block.reason ?? null,
  })
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/admin', 'layout')
  return { success: true }
}

export async function deleteAvailabilityBlock(id: string): Promise<ActionResult> {
  await requireAdmin()
  const svc = createServiceClient()
  const { error } = await svc.from('availability_blocks').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/admin', 'layout')
  return { success: true }
}
