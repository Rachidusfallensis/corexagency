import { createServiceClient } from '@/lib/supabase/service'
import type { ProjectRow, ProjectImageRow, ProjectWithImages } from '@/lib/types/project'

// NOTE : on utilise le service client en lecture publique pour éviter les
// pièges RLS (les pages serveur fonctionnent sans cookie utilisateur sur
// /projets). La policy "projects_public_read" filtre quand même côté DB,
// mais on est protégé en application via WHERE status = 'published'.

export async function getPublishedProjects(category?: 'digitalisation' | 'saas'): Promise<ProjectRow[]> {
  const svc = createServiceClient()
  let q = svc
    .from('projects')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('published_at', { ascending: false })
  if (category) q = q.eq('category', category)
  const { data } = await q
  return (data ?? []) as ProjectRow[]
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectWithImages | null> {
  const svc = createServiceClient()
  const { data: project } = await svc
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (!project) return null
  const { data: images } = await svc
    .from('project_images')
    .select('*')
    .eq('project_id', (project as ProjectRow).id)
    .order('display_order', { ascending: true })
  return {
    ...(project as ProjectRow),
    images: (images ?? []) as ProjectImageRow[],
  }
}

export async function getPrevNextPublishedProjects(currentSlug: string): Promise<{
  prev: { slug: string; title_fr: string; title_en: string } | null
  next: { slug: string; title_fr: string; title_en: string } | null
}> {
  const svc = createServiceClient()
  const { data } = await svc
    .from('projects')
    .select('slug,title_fr,title_en')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
    .order('published_at', { ascending: false })
  const list = (data ?? []) as { slug: string; title_fr: string; title_en: string }[]
  const i = list.findIndex((p) => p.slug === currentSlug)
  if (i === -1) return { prev: null, next: null }
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i < list.length - 1 ? list[i + 1] : null,
  }
}
