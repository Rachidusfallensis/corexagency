export type ProjectCategory = 'digitalisation' | 'saas'
export type ProjectStatus = 'draft' | 'published' | 'archived'

export interface ProjectImageRow {
  id: string
  created_at: string
  project_id: string
  image_url: string
  alt_fr: string | null
  alt_en: string | null
  display_order: number
}

export interface ProjectRow {
  id: string
  created_at: string
  updated_at: string

  slug: string
  category: ProjectCategory
  sector: string

  title_fr: string
  title_en: string
  summary_fr: string
  summary_en: string
  description_fr: string | null
  description_en: string | null
  result_fr: string | null
  result_en: string | null

  cover_image: string | null

  tech_stack: string[]
  tags: string[]

  external_url: string | null

  status: ProjectStatus
  published_at: string | null
  display_order: number
}

export interface ProjectWithImages extends ProjectRow {
  images: ProjectImageRow[]
}

export type ProjectInput = {
  slug: string
  category: ProjectCategory
  sector: string
  title_fr: string
  title_en: string
  summary_fr: string
  summary_en: string
  description_fr?: string | null
  description_en?: string | null
  result_fr?: string | null
  result_en?: string | null
  cover_image?: string | null
  tech_stack?: string[]
  tags?: string[]
  external_url?: string | null
  status?: ProjectStatus
  display_order?: number
}
