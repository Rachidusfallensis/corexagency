import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Corex Admin',
  manifest: '/manifest-admin.json',
  appleWebApp: {
    capable: true,
    title: 'Corex Admin',
    statusBarStyle: 'black-translucent',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
