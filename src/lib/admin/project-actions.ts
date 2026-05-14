'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/service'
import type {
  ProjectInput,
  ProjectRow,
  ProjectImageRow,
  ProjectWithImages,
} from '@/lib/types/project'

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  return user
}

type ActionResult<T = undefined> = { success: boolean; error?: string; data?: T }

const BUCKET = 'project-images'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

// ============ READ ============

export async function getAllProjectsAdmin(): Promise<ProjectRow[]> {
  await requireAdmin()
  const svc = createServiceClient()
  const { data } = await svc
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })
  return (data ?? []) as ProjectRow[]
}

export async function getProjectByIdAdmin(id: string): Promise<ProjectWithImages | null> {
  await requireAdmin()
  const svc = createServiceClient()
  const [{ data: project }, { data: images }] = await Promise.all([
    svc.from('projects').select('*').eq('id', id).single(),
    svc
      .from('project_images')
      .select('*')
      .eq('project_id', id)
      .order('display_order', { ascending: true }),
  ])
  if (!project) return null
  return {
    ...(project as ProjectRow),
    images: (images ?? []) as ProjectImageRow[],
  }
}

// ============ WRITE ============

export async function createProject(input: ProjectInput): Promise<ActionResult<{ id: string }>> {
  await requireAdmin()
  const svc = createServiceClient()

  const slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title_fr)
  if (!slug) return { success: false, error: 'Slug invalide' }

  const payload = {
    slug,
    category: input.category,
    sector: input.sector,
    title_fr: input.title_fr,
    title_en: input.title_en,
    summary_fr: input.summary_fr,
    summary_en: input.summary_en,
    description_fr: input.description_fr ?? null,
    description_en: input.description_en ?? null,
    result_fr: input.result_fr ?? null,
    result_en: input.result_en ?? null,
    cover_image: input.cover_image ?? null,
    tech_stack: input.tech_stack ?? [],
    tags: input.tags ?? [],
    external_url: input.external_url ?? null,
    status: input.status ?? 'draft',
    published_at: input.status === 'published' ? new Date().toISOString() : null,
    display_order: input.display_order ?? 0,
  }

  const { data, error } = await svc
    .from('projects')
    .insert(payload)
    .select('id')
    .single()

  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/projets', 'page')
  revalidatePath('/[locale]/admin/projets', 'page')
  return { success: true, data: { id: (data as { id: string }).id } }
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput>
): Promise<ActionResult> {
  await requireAdmin()
  const svc = createServiceClient()

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (input.slug !== undefined) patch.slug = slugify(input.slug)
  if (input.category !== undefined) patch.category = input.category
  if (input.sector !== undefined) patch.sector = input.sector
  if (input.title_fr !== undefined) patch.title_fr = input.title_fr
  if (input.title_en !== undefined) patch.title_en = input.title_en
  if (input.summary_fr !== undefined) patch.summary_fr = input.summary_fr
  if (input.summary_en !== undefined) patch.summary_en = input.summary_en
  if (input.description_fr !== undefined) patch.description_fr = input.description_fr
  if (input.description_en !== undefined) patch.description_en = input.description_en
  if (input.result_fr !== undefined) patch.result_fr = input.result_fr
  if (input.result_en !== undefined) patch.result_en = input.result_en
  if (input.cover_image !== undefined) patch.cover_image = input.cover_image
  if (input.tech_stack !== undefined) patch.tech_stack = input.tech_stack
  if (input.tags !== undefined) patch.tags = input.tags
  if (input.external_url !== undefined) patch.external_url = input.external_url
  if (input.display_order !== undefined) patch.display_order = input.display_order

  if (input.status !== undefined) {
    patch.status = input.status
    if (input.status === 'published') {
      // Set published_at only if not already set
      const { data: existing } = await svc
        .from('projects')
        .select('published_at')
        .eq('id', id)
        .single()
      if (!existing || !(existing as { published_at: string | null }).published_at) {
        patch.published_at = new Date().toISOString()
      }
    }
  }

  const { error } = await svc.from('projects').update(patch).eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/projets', 'page')
  revalidatePath('/[locale]/projets/[slug]', 'page')
  revalidatePath('/[locale]/admin/projets', 'page')
  return { success: true }
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireAdmin()
  const svc = createServiceClient()
  const { error } = await svc.from('projects').delete().eq('id', id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/projets', 'page')
  revalidatePath('/[locale]/admin/projets', 'page')
  return { success: true }
}

// ============ IMAGES ============

export async function uploadProjectImage(
  projectId: string,
  formData: FormData
): Promise<ActionResult<{ url: string; id: string }>> {
  await requireAdmin()
  const svc = createServiceClient()

  const file = formData.get('file') as File | null
  if (!file) return { success: false, error: 'Aucun fichier' }
  if (!file.type.startsWith('image/')) return { success: false, error: 'Fichier image attendu' }
  if (file.size > 5 * 1024 * 1024) return { success: false, error: 'Image > 5 Mo' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${projectId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

  const { error: uploadError } = await svc.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })

  if (uploadError) return { success: false, error: uploadError.message }

  const { data: pub } = svc.storage.from(BUCKET).getPublicUrl(path)
  const url = pub.publicUrl

  const { data: row, error: insErr } = await svc
    .from('project_images')
    .insert({ project_id: projectId, image_url: url, display_order: 0 })
    .select('id')
    .single()

  if (insErr) return { success: false, error: insErr.message }

  revalidatePath('/[locale]/admin/projets', 'page')
  revalidatePath('/[locale]/projets/[slug]', 'page')
  return { success: true, data: { url, id: (row as { id: string }).id } }
}

export async function uploadProjectCover(
  projectId: string,
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  await requireAdmin()
  const svc = createServiceClient()

  const file = formData.get('file') as File | null
  if (!file) return { success: false, error: 'Aucun fichier' }
  if (!file.type.startsWith('image/')) return { success: false, error: 'Fichier image attendu' }
  if (file.size > 5 * 1024 * 1024) return { success: false, error: 'Image > 5 Mo' }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${projectId}/cover-${Date.now()}.${ext}`

  const { error: uploadError } = await svc.storage
    .from(BUCKET)
    .upload(path, file, { cacheControl: '3600', upsert: false, contentType: file.type })

  if (uploadError) return { success: false, error: uploadError.message }

  const { data: pub } = svc.storage.from(BUCKET).getPublicUrl(path)
  const url = pub.publicUrl

  const { error: updErr } = await svc
    .from('projects')
    .update({ cover_image: url, updated_at: new Date().toISOString() })
    .eq('id', projectId)

  if (updErr) return { success: false, error: updErr.message }

  revalidatePath('/[locale]/admin/projets', 'page')
  revalidatePath('/[locale]/projets/[slug]', 'page')
  return { success: true, data: { url } }
}

export async function deleteProjectImage(imageId: string): Promise<ActionResult> {
  await requireAdmin()
  const svc = createServiceClient()

  const { data: img } = await svc
    .from('project_images')
    .select('image_url')
    .eq('id', imageId)
    .single()

  if (img && (img as { image_url: string }).image_url) {
    const url = (img as { image_url: string }).image_url
    // Try to extract storage path from public URL
    const marker = `/${BUCKET}/`
    const idx = url.indexOf(marker)
    if (idx >= 0) {
      const path = url.slice(idx + marker.length)
      await svc.storage.from(BUCKET).remove([path])
    }
  }

  const { error } = await svc.from('project_images').delete().eq('id', imageId)
  if (error) return { success: false, error: error.message }
  revalidatePath('/[locale]/admin/projets', 'page')
  revalidatePath('/[locale]/projets/[slug]', 'page')
  return { success: true }
}
