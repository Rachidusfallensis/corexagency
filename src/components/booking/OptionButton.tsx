'use client'

type OptionButtonProps = {
  value: string
  selected: boolean
  onClick: (value: string) => void
  icon: React.ReactNode
  title: string
  desc: string
}

export default function OptionButton({
  value,
  selected,
  onClick,
  icon,
  title,
  desc,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(value)}
      className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-200 hover:translate-x-1"
      style={{
        border: selected
          ? '1.5px solid #01EA62'
          : '1.5px solid rgba(255,255,255,0.1)',
        background: selected
          ? 'rgba(1,234,98,0.08)'
          : 'rgba(255,255,255,0.03)',
      }}
    >
      <span
        className="w-10 h-10 rounded-[10px] flex items-center justify-center shrink-0"
        style={{
          background: selected ? 'rgba(1,234,98,0.15)' : 'rgba(255,255,255,0.06)',
        }}
      >
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[0.9rem] font-semibold text-white mb-0.5">
          {title}
        </span>
        <span
          className="block text-[0.78rem] leading-snug"
          style={{
            color: selected ? 'rgba(1,234,98,0.7)' : 'rgba(255,255,255,0.45)',
          }}
        >
          {desc}
        </span>
      </span>
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all"
        style={{
          background: selected ? '#01EA62' : 'transparent',
          border: selected ? '1.5px solid #01EA62' : '1.5px solid rgba(255,255,255,0.2)',
        }}
        aria-hidden
      >
        {selected ? (
          <svg
            width={10}
            height={10}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#050505"
            strokeWidth={3}
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : null}
      </span>
    </button>
  )
}
