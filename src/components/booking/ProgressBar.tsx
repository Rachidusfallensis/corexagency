type ProgressBarProps = {
  currentStep: number
  totalSteps: number
  stepLabel: string
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  stepLabel,
}: ProgressBarProps) {
  const pct = Math.min(100, (currentStep / totalSteps) * 100)
  return (
    <div className="px-10 pt-8">
      <div className="flex justify-between items-center mb-3">
        <span
          className="text-[0.78rem] font-medium"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          {stepLabel}
        </span>
        <span
          className="text-[0.78rem] font-semibold"
          style={{ color: '#01EA62' }}
        >
          {currentStep <= totalSteps ? `${currentStep} / ${totalSteps}` : ''}
        </span>
      </div>
      <div
        className="h-[3px] rounded-[2px] overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      >
        <div
          className="h-full rounded-[2px]"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #016B2D, #01EA62)',
            transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
          }}
        />
      </div>
    </div>
  )
}
