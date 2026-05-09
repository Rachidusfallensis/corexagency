type ExampleCardProps = {
  sector: string
  title: string
  desc: string
  result: string
  dark?: boolean
}

export default function ExampleCard({
  sector,
  title,
  desc,
  result,
  dark = false,
}: ExampleCardProps) {
  return (
    <article
      className={`rounded-2xl p-6 transition-all duration-200 hover:-translate-y-1 ${
        dark
          ? 'bg-surface border border-white/[0.07] hover:border-green-vivid/30 hover:shadow-[0_12px_35px_rgba(1,234,98,0.08)]'
          : 'bg-white border border-black/[0.07] hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]'
      }`}
    >
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 text-[0.72rem] font-bold uppercase tracking-[0.05em]"
        style={
          dark
            ? { background: 'rgba(1,234,98,0.12)', color: '#01EA62' }
            : { background: 'rgba(1,107,45,0.08)', color: '#016B2D' }
        }
      >
        {sector}
      </span>

      <h4
        className={`text-[0.95rem] font-semibold leading-[1.3] mb-2 ${
          dark ? 'text-white' : 'text-corex-black'
        }`}
      >
        {title}
      </h4>

      <p
        className="text-[0.82rem] leading-[1.65]"
        style={{ color: dark ? 'rgba(255,255,255,0.5)' : '#6B7280' }}
      >
        {desc}
      </p>

      <div
        className="inline-flex items-center gap-1.5 mt-3.5 text-[0.78rem] font-semibold"
        style={{ color: dark ? '#01EA62' : '#016B2D' }}
      >
        <span aria-hidden>→</span>
        {result}
      </div>
    </article>
  )
}
