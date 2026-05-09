type ServiceBadgeProps = {
  service: string
}

const VARIANTS: Record<string, { bg: string; color: string; label: string }> = {
  digitalisation: {
    bg: 'rgba(96,165,250,0.1)',
    color: '#60A5FA',
    label: 'Digitalisation',
  },
  saas: {
    bg: 'rgba(167,139,250,0.1)',
    color: '#A78BFA',
    label: 'SaaS Builder',
  },
  other: {
    bg: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.5)',
    label: 'Autre',
  },
}

export default function ServiceBadge({ service }: ServiceBadgeProps) {
  const v = VARIANTS[service] ?? VARIANTS.other
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.72rem] font-semibold"
      style={{ background: v.bg, color: v.color }}
    >
      {v.label}
    </span>
  )
}
