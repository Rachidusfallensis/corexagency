'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'

export interface ContentItem {
  id: string
  key: string
  value_fr: string
  value_en: string
  section: string
  label: string
  type: 'text' | 'textarea' | 'list'
  updated_at: string
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  return user
}

/**
 * Récupère tout le contenu groupé par section.
 */
export async function getAllContent(): Promise<Record<string, ContentItem[]>> {
  await requireAdmin()
  const svc = createServiceClient()
  const { data } = await svc
    .from('site_content')
    .select('*')
    .order('section')
    .order('label')

  if (!data) return {}

  return (data as ContentItem[]).reduce<Record<string, ContentItem[]>>(
    (acc, item) => {
      ;(acc[item.section] ||= []).push(item)
      return acc
    },
    {}
  )
}

/**
 * Met à jour un champ de contenu (FR + EN simultané).
 */
export async function updateContent(
  key: string,
  valueFr: string,
  valueEn: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin()
  const svc = createServiceClient()
  const { error } = await svc
    .from('site_content')
    .update({
      value_fr: valueFr,
      value_en: valueEn,
      updated_at: new Date().toISOString(),
    })
    .eq('key', key)

  if (error) return { success: false, error: error.message }
  revalidatePath('/', 'layout')
  return { success: true }
}

/**
 * Récupère le contenu pour le site public (clé→valeur selon locale).
 * Pas de requireAdmin (lecture publique via RLS).
 */
export async function getSiteContent(
  locale: string
): Promise<Record<string, string>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_content')
    .select('key, value_fr, value_en')

  if (!data) return {}

  return (data as { key: string; value_fr: string; value_en: string }[]).reduce<
    Record<string, string>
  >((acc, item) => {
    acc[item.key] = locale === 'en' ? item.value_en : item.value_fr
    return acc
  }, {})
}
