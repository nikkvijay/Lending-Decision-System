import { getScoreColor, getScoreLabel } from '@/utils/formatters'

interface Props {
  score: number
}

const ScoreGauge = ({ score }: Props) => {
  const MIN = 300
  const MAX = 850
  const pct = Math.min(Math.max((score - MIN) / (MAX - MIN), 0), 1)
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  const r = 64
  const cx = 80
  const cy = 80
  const arcLength = Math.PI * r
  const progress = pct * arcLength

  return (
    <div className="flex flex-col items-center py-2">
      <svg viewBox="0 0 160 100" className="w-44 h-28">
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#e5e5e5"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Progress */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${arcLength}`}
        />
      </svg>
      <div className="text-center -mt-6">
        <p className="text-5xl font-bold tracking-tight" style={{ color }}>{score}</p>
        <p className="text-xs text-neutral-400 mt-1 font-medium uppercase tracking-wider">{label}</p>
      </div>
    </div>
  )
}

export default ScoreGauge
