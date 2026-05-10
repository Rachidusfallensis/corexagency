import type { MetadataRoute } from 'next'

const BASE = 'https://corexagency.vercel.app'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}/fr`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/en`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/fr/rendez-vous`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/en/rendez-vous`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/fr/digitalisation`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/en/digitalisation`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/fr/saas-builder`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/en/saas-builder`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/fr/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/en/a-propos`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
