import type { DecisionResult } from '@/contexts/ApplicationContext'
import ScoreGauge from './ScoreGauge'

interface Props {
  result: DecisionResult
  onReset: () => void
}

const ApprovedView = ({ result, onReset }: Props) => (
  <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
    {/* Status bar */}
    <div className="h-1 bg-emerald-500" />

    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
              Approved
            </span>
          </div>
          <h2 className="text-xl font-semibold text-neutral-900">Application accepted</h2>
          <p className="text-sm text-neutral-400 mt-1">
            Your loan application meets our lending criteria
          </p>
        </div>
      </div>

      <ScoreGauge score={result.creditScore || 0} />

      <div className="border-t border-neutral-100 pt-4">
        <button
          onClick={onReset}
          className="w-full border border-neutral-200 text-neutral-700 text-sm font-medium py-2.5 rounded-lg hover:bg-neutral-50 transition-colors"
        >
          Start new application
        </button>
      </div>
    </div>
  </div>
)

export default ApprovedView
