type StatCardProps = {
  value: number | string
  label: string
  icon: React.ReactNode
  iconVariant?: 'green' | 'orange' | 'blue' | 'purple'
  trend?: string
  trendVariant?: 'up' | 'neutral'
}

export default function StatCard({
  value,
  label,
  icon,
  iconVariant = 'green',
  trend,
  trendVariant = 'up',
}: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${iconVariant}`}>{icon}</div>
        {trend && (
          <span className={`stat-trend ${trendVariant}`}>{trend}</span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}
