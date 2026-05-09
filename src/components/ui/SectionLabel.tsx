import { cn } from '@/lib/utils'

type SectionLabelProps = {
  children: React.ReactNode
  color?: 'green-deep' | 'green-vivid'
  className?: string
}

export default function SectionLabel({
  children,
  color = 'green-deep',
  className,
}: SectionLabelProps) {
  return (
    <span
      className={cn(
        'inline-block text-[0.78rem] font-bold uppercase tracking-[0.1em] mb-3',
        color === 'green-vivid' ? 'text-green-vivid' : 'text-green-deep',
        className
      )}
    >
      {children}
    </span>
  )
}
