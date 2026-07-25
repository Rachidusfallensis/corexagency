type StatusBadgeProps = {
  status: string
}

const LABELS: Record<string, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  cancelled: 'Annulé',
  rescheduled: 'Replanifié',
  waiting: 'En file',
  invited: 'Invité',
  converted: 'Converti',
  rejected: 'Rejeté',
  new: 'Nouveau',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${status}`}>
      {LABELS[status] ?? status}
    </span>
  )
}
