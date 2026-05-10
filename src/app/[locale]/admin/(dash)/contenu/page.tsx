'use client'

import { useEffect, useMemo, useState } from 'react'
import AdminShell from '@/components/admin/AdminShell'
import { useToast } from '@/components/admin/Toast'
import {
  getAllContent,
  updateContent,
  type ContentItem,
} from '@/lib/admin/content-actions'

type Edits = Record<string, { fr: string; en: string }>

function ContentInner() {
  const toast = useToast()
  const [content, setContent] = useState<Record<string, ContentItem[]>>({})
  const [activeSection, setActiveSection] = useState<string>('Hero')
  const [edited, setEdited] = useState<Edits>({})
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [previewLocale, setPreviewLocale] = useState<'fr' | 'en'>('fr')
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const data = await getAllContent()
    setContent(data)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  const sections = useMemo(() => Object.keys(content), [content])

  useEffect(() => {
    if (sections.length > 0 && !sections.includes(activeSection)) {
      setActiveSection(sections[0])
    }
  }, [sections, activeSection])

  const items = content[activeSection] ?? []

  function readValue(item: ContentItem) {
    const e = edited[item.key]
    if (previewLocale === 'fr') return e?.fr ?? item.value_fr
    return e?.en ?? item.value_en
  }

  function writeValue(item: ContentItem, value: string) {
    setEdited((prev) => ({
      ...prev,
      [item.key]: {
        fr: previewLocale === 'fr' ? value : prev[item.key]?.fr ?? item.value_fr,
        en: previewLocale === 'en' ? value : prev[item.key]?.en ?? item.value_en,
      },
    }))
  }

  async function saveOne(item: ContentItem) {
    setSaving(item.key)
    const cur = edited[item.key]
    const res = await updateContent(
      item.key,
      cur?.fr ?? item.value_fr,
      cur?.en ?? item.value_en
    )
    setSaving(null)
    if (res.success) {
      setSaved(item.key)
      setTimeout(() => setSaved(null), 2000)
      toast.show('Contenu sauvegardé', 'success')
      // Clear the edit for this key but reflect new values in `content`
      setContent((prev) => {
        const next = { ...prev }
        for (const sec of Object.keys(next)) {
          next[sec] = next[sec].map((it) =>
            it.key === item.key
              ? {
                  ...it,
                  value_fr: cur?.fr ?? it.value_fr,
                  value_en: cur?.en ?? it.value_en,
                }
              : it
          )
        }
        return next
      })
      setEdited((prev) => {
        const next = { ...prev }
        delete next[item.key]
        return next
      })
    } else {
      toast.show(res.error ?? 'Erreur', 'danger')
    }
  }

  async function saveAll() {
    const keys = Object.keys(edited)
    if (keys.length === 0) return
    setSaving('all')
    let okCount = 0
    for (const key of keys) {
      const cur = edited[key]
      // Find the item to know fallback values
      let original: ContentItem | undefined
      for (const sec of Object.values(content)) {
        original = sec.find((i) => i.key === key)
        if (original) break
      }
      if (!original) continue
      const res = await updateContent(
        key,
        cur.fr ?? original.value_fr,
        cur.en ?? original.value_en
      )
      if (res.success) okCount++
    }
    setSaving(null)
    setSaved('all')
    setTimeout(() => setSaved(null), 2000)
    toast.show(`${okCount} contenu(s) sauvegardé(s)`, 'success')
    await refresh()
    setEdited({})
  }

  const inputBase: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: '#fff',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    outline: 'none',
    lineHeight: 1.6,
  }

  if (loading) {
    return (
      <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '2rem' }}>
        Chargement du contenu…
      </p>
    )
  }

  return (
    <>
      {/* Onglets sections */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {sections.map((section) => {
          const active = section === activeSection
          return (
            <button
              key={section}
              type="button"
              onClick={() => setActiveSection(section)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '50px',
                border: `1.5px solid ${active ? '#01EA62' : 'rgba(255,255,255,0.1)'}`,
                background: active ? 'rgba(1,234,98,0.1)' : 'transparent',
                color: active ? '#01EA62' : 'rgba(255,255,255,0.5)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {section}
            </button>
          )
        })}
      </div>

      {/* Toggle locale */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)' }}>
          Langue d&apos;édition :
        </span>
        <button
          type="button"
          onClick={() => setPreviewLocale('fr')}
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '50px',
            border: `1px solid ${previewLocale === 'fr' ? '#01EA62' : 'rgba(255,255,255,0.1)'}`,
            background: previewLocale === 'fr' ? 'rgba(1,234,98,0.1)' : 'transparent',
            color: previewLocale === 'fr' ? '#01EA62' : 'rgba(255,255,255,0.4)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          FR
        </button>
        <button
          type="button"
          onClick={() => setPreviewLocale('en')}
          style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '50px',
            border: `1px solid ${previewLocale === 'en' ? '#01EA62' : 'rgba(255,255,255,0.1)'}`,
            background: previewLocale === 'en' ? 'rgba(1,234,98,0.1)' : 'transparent',
            color: previewLocale === 'en' ? '#01EA62' : 'rgba(255,255,255,0.4)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          EN
        </button>
      </div>

      {/* Champs */}
      {items.map((item) => {
        const dirty = !!edited[item.key]
        const value = readValue(item)
        return (
          <div
            key={item.key}
            style={{
              background: '#161616',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '14px',
              padding: '1.25rem',
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                color: 'rgba(255,255,255,0.4)',
                marginBottom: '0.75rem',
              }}
            >
              {item.label}
              <span style={{ marginLeft: '0.5rem', color: 'rgba(255,255,255,0.2)', fontWeight: 500, textTransform: 'none' }}>
                {item.key}
              </span>
            </div>

            {item.type === 'textarea' ? (
              <textarea
                value={value}
                onChange={(e) => writeValue(item, e.target.value)}
                rows={3}
                style={{ ...inputBase, resize: 'vertical' }}
              />
            ) : (
              <input
                type="text"
                value={value}
                onChange={(e) => writeValue(item, e.target.value)}
                style={inputBase}
              />
            )}

            {dirty && (
              <div
                style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: 'rgba(1,234,98,0.04)',
                  border: '1px solid rgba(1,234,98,0.15)',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    fontSize: '0.65rem',
                    color: '#01EA62',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    display: 'block',
                    marginBottom: '0.25rem',
                  }}
                >
                  Aperçu ({previewLocale.toUpperCase()})
                </span>
                {value}
              </div>
            )}

            {dirty && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => saveOne(item)}
                  disabled={saving === item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '0.5rem 1.25rem',
                    borderRadius: '9px',
                    background: saved === item.key ? 'rgba(1,234,98,0.15)' : '#01EA62',
                    color: saved === item.key ? '#01EA62' : '#050505',
                    border: saved === item.key ? '1px solid #01EA62' : 'none',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: saving === item.key ? 'not-allowed' : 'pointer',
                    opacity: saving === item.key ? 0.6 : 1,
                    fontFamily: 'inherit',
                  }}
                >
                  {saving === item.key ? 'Sauvegarde…' : saved === item.key ? '✓ Sauvegardé' : 'Sauvegarder'}
                </button>
              </div>
            )}
          </div>
        )
      })}

      {Object.keys(edited).length > 0 && (
        <button
          type="button"
          onClick={saveAll}
          disabled={saving === 'all'}
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: '12px',
            background: saved === 'all' ? 'rgba(1,234,98,0.15)' : '#016B2D',
            color: saved === 'all' ? '#01EA62' : '#fff',
            border: saved === 'all' ? '1px solid #01EA62' : 'none',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: saving === 'all' ? 'not-allowed' : 'pointer',
            marginTop: '1rem',
            opacity: saving === 'all' ? 0.6 : 1,
            fontFamily: 'inherit',
          }}
        >
          {saving === 'all'
            ? 'Sauvegarde…'
            : saved === 'all'
              ? '✓ Tout sauvegardé !'
              : `Sauvegarder toutes les modifications (${Object.keys(edited).length})`}
        </button>
      )}
    </>
  )
}

export default function ContenuPage() {
  return (
    <AdminShell
      title="Contenu du site"
      subtitle="Modifiez les textes affichés sur votre site"
    >
      <ContentInner />
    </AdminShell>
  )
}
