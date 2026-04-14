import type { DecisionResult } from '@/contexts/ApplicationContext'
import ScoreGauge from './ScoreGauge'
import ReasonCodeBadge from './ReasonCodeBadge'

interface Props {
  result: DecisionResult
  onReset: () => void
}

const RejectedView = ({ result, onReset }: Props) => (
  <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
    {/* Status bar */}
    <div className="h-1 bg-red-400" />

    <div className="p-8 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-xs font-medium text-red-500 uppercase tracking-wider">
            Not approved
          </span>
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">Application declined</h2>
        <p className="text-sm text-neutral-400 mt-1">
          Your application did not meet our current lending criteria
        </p>
      </div>

      <ScoreGauge score={result.creditScore || 0} />

      {result.reasonCodes && result.reasonCodes.length > 0 && (
        <div className="space-y-2.5">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Decline reasons
          </p>
          <div className="flex flex-wrap gap-2">
            {result.reasonCodes.map((code) => (
              <ReasonCodeBadge key={code} code={code} />
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-neutral-100 pt-4">
        <button
          onClick={onReset}
          className="w-full bg-neutral-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
)

export default RejectedView
