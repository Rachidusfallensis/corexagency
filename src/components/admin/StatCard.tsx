type StatCardProps = {
  value: number | string
  label: string
  icon: React.ReactNode
  iconBg?: string
  trend?: string
  trendVariant?: 'up' | 'neutral'
}

export default function StatCard({
  value,
  label,
  icon,
  iconBg = 'rgba(1,234,98,0.1)',
  trend,
  trendVariant = 'up',
}: StatCardProps) {
  return (
    <div
      className="rounded-[18px] p-5"
      style={{
        background: '#111111',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-9 h-9 rounded-[9px] flex items-center justify-center"
          style={{ background: iconBg }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background:
                trendVariant === 'up'
                  ? 'rgba(1,234,98,0.1)'
                  : 'rgba(255,255,255,0.06)',
              color:
                trendVariant === 'up' ? '#01EA62' : 'rgba(255,255,255,0.5)',
            }}
          >
            {trend}
          </span>
        )}
      </div>
      <div
        className="text-[1.6rem] font-extrabold leading-none"
        style={{ letterSpacing: '-0.03em' }}
      >
        {value}
      </div>
      <div
        className="text-[0.72rem] mt-1"
        style={{ color: 'rgba(255,255,255,0.5)' }}
      >
        {label}
      </div>
    </div>
  )
}
