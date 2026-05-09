'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { LOGOS, LOGO_SIZES } from '@/lib/assets'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push(`/${locale}/admin`)
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#050505' }}>
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <Image
          src={LOGOS.blanc}
          alt="Corex"
          width={LOGO_SIZES.nav.width}
          height={LOGO_SIZES.nav.height}
          priority
        />
        <h1 className="text-2xl font-bold text-white mt-8 mb-8">Accès admin</h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] mb-1.5"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="rounded-xl px-4 py-3 text-[0.9rem] text-white outline-none focus:border-green-vivid/50"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>

          <div className="flex flex-col">
            <label
              className="text-[0.78rem] font-semibold uppercase tracking-[0.06em] mb-1.5"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="rounded-xl px-4 py-3 text-[0.9rem] text-white outline-none focus:border-green-vivid/50"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(255,255,255,0.1)',
              }}
            />
          </div>

          {error && (
            <p className="text-[0.85rem]" style={{ color: '#EF4444' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-full py-3.5 mt-2 text-[0.9rem] font-bold disabled:opacity-50"
            style={{ background: '#01EA62', color: '#050505' }}
          >
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
