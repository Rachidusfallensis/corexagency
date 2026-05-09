type StatusBadgeProps = {
  status: string
}

const VARIANTS: Record<
  string,
  { bg: string; color: string; label: string }
> = {
  pending: { bg: 'rgba(251,191,36,0.1)', color: '#FBBF24', label: 'En attente' },
  confirmed: { bg: 'rgba(1,234,98,0.1)', color: '#01EA62', label: 'Confirmé' },
  cancelled: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', label: 'Annulé' },
  waiting: { bg: 'rgba(156,163,175,0.1)', color: '#9CA3AF', label: 'En file' },
  invited: { bg: 'rgba(96,165,250,0.1)', color: '#60A5FA', label: 'Invité' },
  converted: { bg: 'rgba(1,234,98,0.1)', color: '#01EA62', label: 'Converti' },
  rejected: { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', label: 'Rejeté' },
  new: { bg: 'rgba(96,165,250,0.1)', color: '#60A5FA', label: 'Nouveau' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const v = VARIANTS[status] ?? {
    bg: 'rgba(255,255,255,0.06)',
    color: '#9CA3AF',
    label: status,
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-semibold whitespace-nowrap"
      style={{ background: v.bg, color: v.color }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: v.color }}
      />
      {v.label}
    </span>
  )
}
