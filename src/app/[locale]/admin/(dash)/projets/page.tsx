'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import AdminShell from '@/components/admin/AdminShell'
import { useToast } from '@/components/admin/Toast'
import {
  getAllProjectsAdmin,
  getProjectByIdAdmin,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
  uploadProjectCover,
  deleteProjectImage,
} from '@/lib/admin/project-actions'
import type {
  ProjectRow,
  ProjectWithImages,
  ProjectCategory,
  ProjectStatus,
} from '@/lib/types/project'

type Tab = 'general' | 'content' | 'media'

type FormState = {
  slug: string
  category: ProjectCategory
  sector: string
  title_fr: string
  title_en: string
  summary_fr: string
  summary_en: string
  description_fr: string
  description_en: string
  result_fr: string
  result_en: string
  external_url: string
  tech_stack: string
  tags: string
  status: ProjectStatus
  display_order: number
}

const EMPTY_FORM: FormState = {
  slug: '',
  category: 'digitalisation',
  sector: '',
  title_fr: '',
  title_en: '',
  summary_fr: '',
  summary_en: '',
  description_fr: '',
  description_en: '',
  result_fr: '',
  result_en: '',
  external_url: '',
  tech_stack: '',
  tags: '',
  status: 'draft',
  display_order: 0,
}

function ProjectsAdminInner() {
  const toast = useToast()
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('general')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [current, setCurrent] = useState<ProjectWithImages | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  async function refresh() {
    setLoading(true)
    const list = await getAllProjectsAdmin()
    setProjects(list)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  function openCreate() {
    setEditingId(null)
    setCurrent(null)
    setForm(EMPTY_FORM)
    setActiveTab('general')
    setModalOpen(true)
  }

  async function openEdit(id: string) {
    setEditingId(id)
    setActiveTab('general')
    setModalOpen(true)
    const p = await getProjectByIdAdmin(id)
    if (!p) {
      toast.show('Projet introuvable', 'danger')
      setModalOpen(false)
      return
    }
    setCurrent(p)
    setForm({
      slug: p.slug,
      category: p.category,
      sector: p.sector,
      title_fr: p.title_fr,
      title_en: p.title_en,
      summary_fr: p.summary_fr,
      summary_en: p.summary_en,
      description_fr: p.description_fr ?? '',
      description_en: p.description_en ?? '',
      result_fr: p.result_fr ?? '',
      result_en: p.result_en ?? '',
      external_url: p.external_url ?? '',
      tech_stack: (p.tech_stack ?? []).join(', '),
      tags: (p.tags ?? []).join(', '),
      status: p.status,
      display_order: p.display_order,
    })
  }

  function closeModal() {
    setModalOpen(false)
    setCurrent(null)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  function patch<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    if (!form.title_fr.trim() || !form.title_en.trim()) {
      toast.show('Titre FR et EN requis', 'danger')
      return
    }
    if (!form.summary_fr.trim() || !form.summary_en.trim()) {
      toast.show('Résumé FR et EN requis', 'danger')
      return
    }
    if (!form.sector.trim()) {
      toast.show('Secteur requis', 'danger')
      return
    }
    setSaving(true)
    const input = {
      slug: form.slug.trim() || form.title_fr,
      category: form.category,
      sector: form.sector.trim(),
      title_fr: form.title_fr.trim(),
      title_en: form.title_en.trim(),
      summary_fr: form.summary_fr.trim(),
      summary_en: form.summary_en.trim(),
      description_fr: form.description_fr.trim() || null,
      description_en: form.description_en.trim() || null,
      result_fr: form.result_fr.trim() || null,
      result_en: form.result_en.trim() || null,
      external_url: form.external_url.trim() || null,
      tech_stack: form.tech_stack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      status: form.status,
      display_order: Number(form.display_order) || 0,
    }

    const res = editingId
      ? await updateProject(editingId, input)
      : await createProject(input)
    setSaving(false)
    if (!res.success) {
      toast.show(res.error ?? 'Erreur', 'danger')
      return
    }
    toast.show(editingId ? 'Projet mis à jour' : 'Projet créé', 'success')
    if (!editingId && 'data' in res && res.data?.id) {
      // Continue in edit mode to upload media
      await openEdit(res.data.id)
    } else if (editingId) {
      const p = await getProjectByIdAdmin(editingId)
      if (p) setCurrent(p)
    }
    refresh()
  }

  async function handleDelete(id: string) {
    const res = await deleteProject(id)
    if (!res.success) {
      toast.show(res.error ?? 'Erreur', 'danger')
      return
    }
    toast.show('Projet supprimé', 'success')
    setConfirmDelete(null)
    refresh()
  }

  async function handleUploadCover(file: File) {
    if (!editingId) {
      toast.show("Crée d'abord le projet (onglet Général)", 'danger')
      return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadProjectCover(editingId, fd)
    setUploading(false)
    if (!res.success) {
      toast.show(res.error ?? 'Erreur upload', 'danger')
      return
    }
    toast.show('Couverture mise à jour', 'success')
    const p = await getProjectByIdAdmin(editingId)
    if (p) setCurrent(p)
    refresh()
  }

  async function handleUploadImage(file: File) {
    if (!editingId) {
      toast.show("Crée d'abord le projet (onglet Général)", 'danger')
      return
    }
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await uploadProjectImage(editingId, fd)
    setUploading(false)
    if (!res.success) {
      toast.show(res.error ?? 'Erreur upload', 'danger')
      return
    }
    toast.show('Image ajoutée', 'success')
    const p = await getProjectByIdAdmin(editingId)
    if (p) setCurrent(p)
  }

  async function handleDeleteImage(imageId: string) {
    const res = await deleteProjectImage(imageId)
    if (!res.success) {
      toast.show(res.error ?? 'Erreur', 'danger')
      return
    }
    toast.show('Image supprimée', 'success')
    if (editingId) {
      const p = await getProjectByIdAdmin(editingId)
      if (p) setCurrent(p)
    }
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
          {loading ? 'Chargement...' : `${projects.length} projet${projects.length > 1 ? 's' : ''}`}
        </div>
        <button
          type="button"
          onClick={openCreate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '0.5rem 1rem',
            borderRadius: 9,
            background: '#01EA62',
            color: '#050505',
            fontSize: '0.82rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          + Nouveau projet
        </button>
      </div>

      {loading ? (
        <div style={{ color: 'rgba(255,255,255,0.4)', padding: '2rem' }}>Chargement...</div>
      ) : projects.length === 0 ? (
        <div
          style={{
            padding: '3rem',
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: 14,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          Aucun projet. Cliquez sur « + Nouveau projet » pour créer le premier.
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {projects.map((p) => (
            <article
              key={p.id}
              style={{
                background: '#111',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16 / 10',
                  background:
                    p.category === 'saas'
                      ? 'linear-gradient(135deg,#050505,#016B2D)'
                      : 'linear-gradient(135deg,#161616,#1C1C1C)',
                }}
              >
                {p.cover_image ? (
                  <Image
                    src={p.cover_image}
                    alt={p.title_fr}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : null}
                <span
                  style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 50,
                    background:
                      p.status === 'published'
                        ? 'rgba(1,234,98,0.15)'
                        : p.status === 'draft'
                          ? 'rgba(251,191,36,0.15)'
                          : 'rgba(156,163,175,0.15)',
                    color:
                      p.status === 'published'
                        ? '#01EA62'
                        : p.status === 'draft'
                          ? '#FBBF24'
                          : '#9CA3AF',
                  }}
                >
                  {p.status}
                </span>
              </div>
              <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>
                  {p.category === 'saas' ? 'SaaS Builder' : 'Digitalisation'} · {p.sector}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 8 }}>
                  {p.title_fr}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.5,
                    marginBottom: '0.85rem',
                    flex: 1,
                  }}
                >
                  /{p.slug}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => openEdit(p.id)}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      borderRadius: 7,
                      background: 'rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(p.id)}
                    style={{
                      padding: '0.4rem 0.65rem',
                      borderRadius: 7,
                      background: 'rgba(239,68,68,0.08)',
                      color: '#EF4444',
                      border: 'none',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                  >
                    Suppr
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* DELETE CONFIRM */}
      {confirmDelete && (
        <div
          className="modal-overlay open"
          onClick={() => setConfirmDelete(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              width: 400,
              maxWidth: '90vw',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                Supprimer ce projet ?
              </h3>
              <p
                style={{
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.5,
                  marginBottom: '1.25rem',
                }}
              >
                Cette action est définitive. Toutes les images associées seront aussi supprimées.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(null)}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: 9,
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.5)',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(confirmDelete)}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: 9,
                    background: 'rgba(239,68,68,0.15)',
                    color: '#EF4444',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 150,
            padding: '1.5rem',
          }}
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 20,
              width: 720,
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 3rem)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>
                {editingId ? 'Modifier le projet' : 'Nouveau projet'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 7,
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                ×
              </button>
            </div>

            {/* TABS */}
            <div
              style={{
                display: 'flex',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
                padding: '0 1.5rem',
              }}
            >
              {[
                { key: 'general' as const, label: 'Général' },
                { key: 'content' as const, label: 'Contenu' },
                { key: 'media' as const, label: 'Médias' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'transparent',
                    border: 'none',
                    color:
                      activeTab === tab.key ? '#01EA62' : 'rgba(255,255,255,0.5)',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    borderBottom:
                      activeTab === tab.key
                        ? '2px solid #01EA62'
                        : '2px solid transparent',
                    marginBottom: -1,
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>
              {activeTab === 'general' && (
                <GeneralTab form={form} patch={patch} editingId={editingId} />
              )}
              {activeTab === 'content' && <ContentTab form={form} patch={patch} />}
              {activeTab === 'media' && (
                <MediaTab
                  current={current}
                  editingId={editingId}
                  uploading={uploading}
                  onUploadCover={handleUploadCover}
                  onUploadImage={handleUploadImage}
                  onDeleteImage={handleDeleteImage}
                />
              )}
            </div>

            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.07)',
                display: 'flex',
                gap: '0.5rem',
                justifyContent: 'flex-end',
              }}
            >
              <button
                type="button"
                onClick={closeModal}
                style={{
                  padding: '0.6rem 1.25rem',
                  borderRadius: 9,
                  background: 'rgba(255,255,255,0.05)',
                  color: 'rgba(255,255,255,0.5)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Fermer
              </button>
              {(activeTab === 'general' || activeTab === 'content') && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: 9,
                    background: '#01EA62',
                    color: '#050505',
                    border: 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: saving ? 'wait' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                    fontFamily: 'inherit',
                  }}
                >
                  {saving ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Créer'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ============ TABS ============

function inputStyle(): React.CSSProperties {
  return {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.07)',
    borderRadius: 10,
    padding: '0.65rem 0.85rem',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.85rem',
    fontFamily: 'inherit',
    outline: 'none',
  }
}
function labelStyle(): React.CSSProperties {
  return {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.4rem',
  }
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={labelStyle()}>{label}</label>
      {children}
    </div>
  )
}

function GeneralTab({
  form,
  patch,
  editingId,
}: {
  form: FormState
  patch: <K extends keyof FormState>(key: K, value: FormState[K]) => void
  editingId: string | null
}) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Catégorie">
          <select
            value={form.category}
            onChange={(e) => patch('category', e.target.value as ProjectCategory)}
            style={inputStyle()}
          >
            <option value="digitalisation">Digitalisation</option>
            <option value="saas">SaaS Builder</option>
          </select>
        </Field>
        <Field label="Statut">
          <select
            value={form.status}
            onChange={(e) => patch('status', e.target.value as ProjectStatus)}
            style={inputStyle()}
          >
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        <Field label="Secteur (ex. Restauration)">
          <input
            type="text"
            value={form.sector}
            onChange={(e) => patch('sector', e.target.value)}
            style={inputStyle()}
          />
        </Field>
        <Field label="Ordre d'affichage">
          <input
            type="number"
            value={form.display_order}
            onChange={(e) => patch('display_order', Number(e.target.value))}
            style={inputStyle()}
          />
        </Field>
      </div>
      <Field label={`Slug (URL) ${editingId ? '' : '— auto-généré si vide'}`}>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => patch('slug', e.target.value)}
          placeholder="mon-super-projet"
          style={inputStyle()}
        />
      </Field>
      <Field label="Lien externe (optionnel)">
        <input
          type="url"
          value={form.external_url}
          onChange={(e) => patch('external_url', e.target.value)}
          placeholder="https://exemple.com"
          style={inputStyle()}
        />
      </Field>
      <Field label="Stack technique (séparés par virgule)">
        <input
          type="text"
          value={form.tech_stack}
          onChange={(e) => patch('tech_stack', e.target.value)}
          placeholder="Next.js, Supabase, TypeScript"
          style={inputStyle()}
        />
      </Field>
      <Field label="Tags (séparés par virgule)">
        <input
          type="text"
          value={form.tags}
          onChange={(e) => patch('tags', e.target.value)}
          placeholder="ERP, automatisation"
          style={inputStyle()}
        />
      </Field>
    </>
  )
}

function ContentTab({
  form,
  patch,
}: {
  form: FormState
  patch: <K extends keyof FormState>(key: K, value: FormState[K]) => void
}) {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Titre (FR)">
          <input
            type="text"
            value={form.title_fr}
            onChange={(e) => patch('title_fr', e.target.value)}
            style={inputStyle()}
          />
        </Field>
        <Field label="Titre (EN)">
          <input
            type="text"
            value={form.title_en}
            onChange={(e) => patch('title_en', e.target.value)}
            style={inputStyle()}
          />
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Résumé (FR)">
          <textarea
            value={form.summary_fr}
            onChange={(e) => patch('summary_fr', e.target.value)}
            rows={3}
            style={{ ...inputStyle(), resize: 'vertical' }}
          />
        </Field>
        <Field label="Résumé (EN)">
          <textarea
            value={form.summary_en}
            onChange={(e) => patch('summary_en', e.target.value)}
            rows={3}
            style={{ ...inputStyle(), resize: 'vertical' }}
          />
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Description complète (FR)">
          <textarea
            value={form.description_fr}
            onChange={(e) => patch('description_fr', e.target.value)}
            rows={7}
            style={{ ...inputStyle(), resize: 'vertical' }}
          />
        </Field>
        <Field label="Description complète (EN)">
          <textarea
            value={form.description_en}
            onChange={(e) => patch('description_en', e.target.value)}
            rows={7}
            style={{ ...inputStyle(), resize: 'vertical' }}
          />
        </Field>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Résultat (FR)">
          <input
            type="text"
            value={form.result_fr}
            onChange={(e) => patch('result_fr', e.target.value)}
            placeholder="MVP livré en 8 semaines"
            style={inputStyle()}
          />
        </Field>
        <Field label="Résultat (EN)">
          <input
            type="text"
            value={form.result_en}
            onChange={(e) => patch('result_en', e.target.value)}
            placeholder="MVP delivered in 8 weeks"
            style={inputStyle()}
          />
        </Field>
      </div>
    </>
  )
}

function MediaTab({
  current,
  editingId,
  uploading,
  onUploadCover,
  onUploadImage,
  onDeleteImage,
}: {
  current: ProjectWithImages | null
  editingId: string | null
  uploading: boolean
  onUploadCover: (f: File) => void
  onUploadImage: (f: File) => void
  onDeleteImage: (id: string) => void
}) {
  if (!editingId) {
    return (
      <div
        style={{
          padding: '2rem',
          border: '1px dashed rgba(255,255,255,0.12)',
          borderRadius: 12,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.85rem',
        }}
      >
        Crée d&apos;abord le projet (onglets « Général » + « Contenu »), puis reviens ici pour
        ajouter les images.
      </div>
    )
  }

  return (
    <>
      {/* COVER */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={labelStyle()}>Image de couverture</label>
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            borderRadius: 12,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            marginBottom: '0.75rem',
          }}
        >
          {current?.cover_image ? (
            <Image
              src={current.cover_image}
              alt=""
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 640px"
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255,255,255,0.3)',
                fontSize: '0.85rem',
              }}
            >
              Aucune couverture
            </div>
          )}
        </div>
        <label
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: 9,
            background: 'rgba(1,234,98,0.1)',
            color: '#01EA62',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: uploading ? 'wait' : 'pointer',
          }}
        >
          {uploading ? 'Upload...' : current?.cover_image ? 'Remplacer' : 'Uploader'}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onUploadCover(f)
              e.target.value = ''
            }}
          />
        </label>
      </div>

      {/* GALLERY */}
      <div>
        <label style={labelStyle()}>Galerie</label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.6rem',
            marginBottom: '0.75rem',
          }}
        >
          {(current?.images ?? []).map((img) => (
            <div
              key={img.id}
              style={{
                position: 'relative',
                aspectRatio: '4 / 3',
                borderRadius: 10,
                overflow: 'hidden',
                background: 'rgba(255,255,255,0.04)',
              }}
            >
              <Image
                src={img.image_url}
                alt=""
                fill
                style={{ objectFit: 'cover' }}
                sizes="200px"
              />
              <button
                type="button"
                onClick={() => onDeleteImage(img.id)}
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: 'rgba(0,0,0,0.65)',
                  color: '#EF4444',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'inherit',
                }}
                aria-label="Supprimer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <label
          style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: 9,
            background: 'rgba(1,234,98,0.1)',
            color: '#01EA62',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: uploading ? 'wait' : 'pointer',
          }}
        >
          {uploading ? 'Upload...' : '+ Ajouter une image'}
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) onUploadImage(f)
              e.target.value = ''
            }}
          />
        </label>
      </div>
    </>
  )
}

export default function ProjectsAdminPage() {
  return (
    <AdminShell title="Projets" subtitle="Gérer les projets affichés sur le site public">
      <ProjectsAdminInner />
    </AdminShell>
  )
}
