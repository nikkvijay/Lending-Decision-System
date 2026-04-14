import { DecisionResult } from '@/contexts/ApplicationContext'
import ScoreGauge from './ScoreGauge'

interface Props {
  result: DecisionResult
  onReset: () => void
}

const ApprovedView = ({ result, onReset }: Props) => (
  <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center space-y-6">
    <div className="flex justify-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl">
        ✓
      </div>
    </div>

    <div>
      <h2 className="text-2xl font-bold text-green-700">Application Approved</h2>
      <p className="text-gray-500 mt-1 text-sm">Your loan application has been approved</p>
    </div>

    <ScoreGauge score={result.creditScore || 0} decision="APPROVED" />

    <button
      onClick={onReset}
      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
    >
      Start New Application
    </button>
  </div>
)

export default ApprovedView
