-- Corex — migration projects (Prompt 16)
-- À exécuter dans Supabase SQL Editor.

-- =====================
-- Table: projects
-- =====================
CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Identification
  slug varchar UNIQUE NOT NULL,

  -- Catégorie
  category varchar CHECK (category IN ('digitalisation','saas')) NOT NULL,
  sector varchar NOT NULL,

  -- Contenu bilingue
  title_fr varchar NOT NULL,
  title_en varchar NOT NULL,
  summary_fr text NOT NULL,
  summary_en text NOT NULL,
  description_fr text,
  description_en text,
  result_fr varchar,
  result_en varchar,

  -- Médias
  cover_image varchar,

  -- Stack & tags (multivalués)
  tech_stack text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',

  -- Lien optionnel
  external_url varchar,

  -- Publication
  status varchar DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  published_at timestamptz,

  -- Ordre d'affichage (asc → desc dans l'admin)
  display_order int DEFAULT 0
);

CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS projects_category_idx ON projects(category);
CREATE INDEX IF NOT EXISTS projects_slug_idx ON projects(slug);

-- =====================
-- Table: project_images (galerie)
-- =====================
CREATE TABLE IF NOT EXISTS project_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz DEFAULT now(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url varchar NOT NULL,
  alt_fr varchar,
  alt_en varchar,
  display_order int DEFAULT 0
);

CREATE INDEX IF NOT EXISTS project_images_project_idx ON project_images(project_id);

-- =====================
-- RLS — Lecture publique sur projets publiés
-- =====================
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "projects_public_read" ON projects;
CREATE POLICY "projects_public_read" ON projects
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "project_images_public_read" ON project_images;
CREATE POLICY "project_images_public_read" ON project_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects p
      WHERE p.id = project_images.project_id
        AND p.status = 'published'
    )
  );

-- Les écritures passent par la service-role key (admin), donc pas besoin de policy d'INSERT/UPDATE/DELETE.

-- =====================
-- Storage bucket : à créer manuellement
-- =====================
-- Dans Supabase Dashboard → Storage :
-- 1. Créer un bucket nommé `project-images`
-- 2. Le rendre PUBLIC
-- 3. Optionnel : limiter à 5 MB par fichier, MIME types image/*
