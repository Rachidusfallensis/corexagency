import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getPublishedProjectBySlug, getPrevNextPublishedProjects } from '@/lib/data/projects'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) return { title: 'Projet | Corex' }
  const title = locale === 'en' ? project.title_en : project.title_fr
  const desc = locale === 'en' ? project.summary_en : project.summary_fr
  return {
    title: `${title} | Corex`,
    description: desc,
    openGraph: project.cover_image
      ? { images: [{ url: project.cover_image }] }
      : undefined,
  }
}

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const project = await getPublishedProjectBySlug(slug)
  if (!project) notFound()

  const t = await getTranslations({ locale, namespace: 'projects' })
  const { prev, next } = await getPrevNextPublishedProjects(slug)

  const title = locale === 'en' ? project.title_en : project.title_fr
  const summary = locale === 'en' ? project.summary_en : project.summary_fr
  const description = locale === 'en' ? project.description_en : project.description_fr
  const result = locale === 'en' ? project.result_en : project.result_fr
  const isSaas = project.category === 'saas'

  return (
    <div
      style={{
        background: '#fff',
        color: '#050505',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        paddingTop: '5rem',
      }}
    >
      {/* BACK LINK */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '1.5rem 2rem 0' }}>
        <Link
          href={`/${locale}/projets`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: '0.85rem',
            color: '#6B7280',
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          ← {t('back')}
        </Link>
      </div>

      {/* HERO */}
      <section style={{ padding: '2rem 0 3rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0.3rem 0.85rem',
                borderRadius: 50,
                background: isSaas ? 'rgba(1,234,98,0.12)' : 'rgba(1,107,45,0.08)',
                color: isSaas ? '#01EA62' : '#016B2D',
              }}
            >
              {isSaas ? t('filterSaas') : t('filterDigital')}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0.3rem 0.85rem',
                borderRadius: 50,
                background: '#F4F6F4',
                color: '#050505',
              }}
            >
              {project.sector}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem,4.5vw,3.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              marginBottom: '1.25rem',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: '#6B7280',
              lineHeight: 1.65,
              maxWidth: 740,
              marginBottom: '2rem',
            }}
          >
            {summary}
          </p>

          {project.cover_image && (
            <div
              style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16 / 9',
                borderRadius: 20,
                overflow: 'hidden',
                background: '#F4F6F4',
                marginTop: '1.5rem',
              }}
            >
              <Image
                src={project.cover_image}
                alt={title}
                fill
                priority
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1100px) 100vw, 1100px"
              />
            </div>
          )}
        </div>
      </section>

      {/* DETAIL GRID */}
      <section style={{ padding: '1rem 0 4rem' }}>
        <div
          style={{
            maxWidth: 1100,
            margin: '0 auto',
            padding: '0 2rem',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: '3rem',
          }}
          className="proj-detail-grid"
        >
          <style>{`
            @media (max-width: 768px) {
              .proj-detail-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
            }
          `}</style>

          {/* COL PRINCIPALE */}
          <div>
            {description && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#016B2D',
                    marginBottom: '1rem',
                  }}
                >
                  {t('description')}
                </h2>
                <div
                  style={{
                    fontSize: '1rem',
                    color: '#374151',
                    lineHeight: 1.85,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {description}
                </div>
              </div>
            )}

            {project.images.length > 0 && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#016B2D',
                    marginBottom: '1rem',
                  }}
                >
                  {t('gallery')}
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0.85rem',
                  }}
                >
                  {project.images.map((img) => {
                    const alt = (locale === 'en' ? img.alt_en : img.alt_fr) ?? title
                    return (
                      <div
                        key={img.id}
                        style={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '4 / 3',
                          borderRadius: 14,
                          overflow: 'hidden',
                          background: '#F4F6F4',
                        }}
                      >
                        <Image
                          src={img.image_url}
                          alt={alt}
                          fill
                          style={{ objectFit: 'cover' }}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside>
            <div
              style={{
                background: '#F4F6F4',
                borderRadius: 18,
                padding: '1.5rem',
                position: 'sticky',
                top: '6rem',
              }}
            >
              {result && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#016B2D',
                      marginBottom: '0.5rem',
                    }}
                  >
                    {t('result')}
                  </h3>
                  <p style={{ fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.5 }}>
                    {result}
                  </p>
                </div>
              )}

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#6B7280',
                      marginBottom: '0.6rem',
                    }}
                  >
                    {t('stack')}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: '0.3rem 0.7rem',
                          borderRadius: 50,
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          background: '#fff',
                          border: '1px solid rgba(0,0,0,0.07)',
                          color: '#050505',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.tags && project.tags.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: '#6B7280',
                      marginBottom: '0.6rem',
                    }}
                  >
                    {t('tags')}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '0.25rem 0.65rem',
                          borderRadius: 50,
                          fontSize: '0.7rem',
                          background: 'rgba(1,107,45,0.08)',
                          color: '#016B2D',
                          fontWeight: 500,
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project.external_url && (
                <a
                  href={project.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0.7rem 1.1rem',
                    borderRadius: 50,
                    background: '#050505',
                    color: '#fff',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    marginBottom: '0.75rem',
                  }}
                >
                  {t('externalLink')} ↗
                </a>
              )}

              <Link
                href={`/${locale}/rendez-vous`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '0.7rem 1.1rem',
                  borderRadius: 50,
                  background: '#016B2D',
                  color: '#fff',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                {locale === 'en' ? 'Book a call' : 'Prendre un RV'} →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* PREV / NEXT */}
      {(prev || next) && (
        <section style={{ padding: '2rem 0 5rem', borderTop: '1px solid rgba(0,0,0,0.07)' }}>
          <div
            style={{
              maxWidth: 1100,
              margin: '0 auto',
              padding: '2rem 2rem 0',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1.5rem',
            }}
          >
            <div>
              {prev && (
                <Link
                  href={`/${locale}/projets/${prev.slug}`}
                  style={{
                    display: 'block',
                    padding: '1.25rem',
                    borderRadius: 14,
                    border: '1px solid rgba(0,0,0,0.07)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color: '#6B7280',
                      marginBottom: '0.4rem',
                    }}
                  >
                    ← {t('prev')}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {locale === 'en' ? prev.title_en : prev.title_fr}
                  </div>
                </Link>
              )}
            </div>
            <div style={{ textAlign: 'right' }}>
              {next && (
                <Link
                  href={`/${locale}/projets/${next.slug}`}
                  style={{
                    display: 'block',
                    padding: '1.25rem',
                    borderRadius: 14,
                    border: '1px solid rgba(0,0,0,0.07)',
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.07em',
                      color: '#6B7280',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {t('next')} →
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                    {locale === 'en' ? next.title_en : next.title_fr}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
