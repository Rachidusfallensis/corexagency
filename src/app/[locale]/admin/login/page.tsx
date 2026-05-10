'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useLocale } from 'next-intl'
import { LOGOS } from '@/lib/assets'
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1.5px solid rgba(255,255,255,0.07)',
    borderRadius: '10px',
    padding: '0.75rem 1rem',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: '0.4rem',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .login-card { padding: 1.75rem !important; border-radius: 16px !important; }
        }
      `}</style>
      <Image
        src={LOGOS.blanc}
        alt="Corex"
        width={140}
        height={47}
        priority
        style={{ marginBottom: '2.5rem' }}
      />

      <form
        onSubmit={handleSubmit}
        className="login-card"
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#111',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '20px',
          padding: '2.5rem',
        }}
      >
        <h1
          style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#fff',
            marginBottom: '1.75rem',
            letterSpacing: '-0.02em',
          }}
        >
          Accès admin
        </h1>

        <div style={{ marginBottom: '1.1rem' }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle}>Mot de passe</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            style={inputStyle}
          />
        </div>

        {error && (
          <p
            style={{
              fontSize: '0.85rem',
              color: '#EF4444',
              marginBottom: '1rem',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.85rem 1.25rem',
            background: '#01EA62',
            color: '#050505',
            border: 'none',
            borderRadius: '50px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.7 : 1,
            fontFamily: 'inherit',
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </div>
  )
}
