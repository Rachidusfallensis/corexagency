import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#050505',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1.5rem',
        textAlign: 'center',
        padding: '2rem',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <Image src="/logos/Corex_Logo_Blanc.png" alt="Corex" width={120} height={40} priority />
      <div style={{ fontSize: '6rem', fontWeight: 800, color: '#01EA62', lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}>
        Page introuvable
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '400px' }}>
        Cette page n&apos;existe pas ou a été déplacée.
      </p>
      <Link
        href="/fr"
        style={{
          background: '#01EA62',
          color: '#050505',
          padding: '0.85rem 2rem',
          borderRadius: '50px',
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: '0.95rem',
        }}
      >
        Retour à l&apos;accueil →
      </Link>
    </div>
  )
}
