import { DecisionResult } from '@/contexts/ApplicationContext'
import ScoreGauge from './ScoreGauge'
import ReasonCodeBadge from './ReasonCodeBadge'

interface Props {
  result: DecisionResult
  onReset: () => void
}

const RejectedView = ({ result, onReset }: Props) => (
  <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 text-center space-y-6">
    <div className="flex justify-center">
      <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-3xl">
        ✕
      </div>
    </div>

    <div>
      <h2 className="text-2xl font-bold text-red-700">Application Rejected</h2>
      <p className="text-gray-500 mt-1 text-sm">Your application did not meet lending criteria</p>
    </div>

    <ScoreGauge score={result.creditScore || 0} decision="REJECTED" />

    {result.reasonCodes && result.reasonCodes.length > 0 && (
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Rejection Reasons</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {result.reasonCodes.map((code) => (
            <ReasonCodeBadge key={code} code={code} />
          ))}
        </div>
      </div>
    )}

    <button
      onClick={onReset}
      className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
    >
      Try Again
    </button>
  </div>
)

export default RejectedView
