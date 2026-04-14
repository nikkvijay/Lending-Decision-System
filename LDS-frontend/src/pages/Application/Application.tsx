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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Lending Decision System</h1>
          <p className="text-gray-500 mt-2">MSME Business Loan Application</p>
        </div>

        {!jobId && <ApplicationForm />}
        {jobId && (status === 'PENDING' || status === 'PROCESSING') && <StatusPoller />}
        {jobId && (status === 'COMPLETED' || status === 'FAILED') && <DecisionResult />}
        {status === 'TIMEOUT' && (
          <div className="text-center p-8 bg-white rounded-xl border border-gray-200">
            <p className="text-red-500 font-medium">Decision is taking longer than expected.</p>
            <p className="text-gray-400 text-sm mt-1">Please refresh and check back shortly.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Application
