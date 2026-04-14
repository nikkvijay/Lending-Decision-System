import { getScoreColor, getScoreLabel } from '@/utils/formatters'

interface Props {
  score: number
  decision: 'APPROVED' | 'REJECTED'
}

const ScoreGauge = ({ score }: Props) => {
  const MIN = 300
  const MAX = 850
  const pct = Math.min(Math.max((score - MIN) / (MAX - MIN), 0), 1)
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  const r = 70
  const cx = 100
  const cy = 90
  const arcLength = Math.PI * r
  const progress = pct * arcLength

  const x1 = cx - r
  const y1 = cy
  const x2 = cx + r
  const y2 = cy

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 110" className="w-52 h-28">
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${arcLength}`}
        />
      </svg>
      <div className="text-center -mt-4">
        <p className="text-4xl font-bold" style={{ color }}>{score}</p>
        <p className="text-sm text-gray-500 mt-0.5">{label} Credit Score</p>
      </div>
    </div>
  )
}

export default ScoreGauge
