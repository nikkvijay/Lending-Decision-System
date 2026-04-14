import { useApplication } from '@/contexts/ApplicationContext'
import { useDecisionPoller } from '@/hooks/useDecisionPoller'
import ApplicationForm from '@/components/application/ApplicationForm'
import StatusPoller from '@/components/shared/StatusPoller'
import DecisionResult from '@/components/result/DecisionResult'
import Navbar from '@/components/shared/Navbar'

const Application = () => {
  const { jobId, status } = useApplication()
  useDecisionPoller()

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-xl mx-auto px-6 py-12">
        {!jobId && (
          <div className="mb-8">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-wider mb-1">
              Loan Application
            </p>
            <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
              Business credit assessment
            </h1>
            <p className="text-sm text-neutral-400 mt-1">
              Fill in your business details to receive an instant decision
            </p>
          </div>
        )}

        {!jobId && <ApplicationForm />}
        {jobId && (status === 'PENDING' || status === 'PROCESSING') && <StatusPoller />}
        {jobId && (status === 'COMPLETED' || status === 'FAILED') && <DecisionResult />}
        {status === 'TIMEOUT' && (
          <div className="bg-white border border-neutral-200 rounded-xl p-8 text-center">
            <p className="text-sm font-medium text-neutral-900">Decision taking longer than expected</p>
            <p className="text-xs text-neutral-400 mt-1">Please refresh and try again shortly.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Application
