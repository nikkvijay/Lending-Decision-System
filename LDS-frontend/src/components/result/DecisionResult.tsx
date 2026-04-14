import { useApplication } from '@/contexts/ApplicationContext'
import ApprovedView from './ApprovedView'
import RejectedView from './RejectedView'

const DecisionResult = () => {
  const { decisionResult, reset } = useApplication()

  if (!decisionResult) return null

  if (decisionResult.decision === 'APPROVED') {
    return <ApprovedView result={decisionResult} onReset={reset} />
  }

  return <RejectedView result={decisionResult} onReset={reset} />
}

export default DecisionResult
