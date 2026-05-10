type ServiceBadgeProps = {
  service: string
}

const VARIANTS: Record<string, { cls: string; label: string }> = {
  digitalisation: { cls: 'digital', label: 'Digitalisation' },
  saas: { cls: 'saas', label: 'SaaS Builder' },
  other: { cls: 'other', label: 'Autre' },
}

export default function ServiceBadge({ service }: ServiceBadgeProps) {
  const v = VARIANTS[service] ?? VARIANTS.other
  return <span className={`res-service ${v.cls}`}>{v.label}</span>
}
