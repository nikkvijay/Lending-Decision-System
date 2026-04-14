import Spinner from './Spinner'
import { useApplication } from '@/contexts/ApplicationContext'

const STATUS_MESSAGES: Record<string, string> = {
  PENDING: 'Queued for review...',
  PROCESSING: 'Analysing your application...',
}

const StatusPoller = () => {
  const { status } = useApplication()

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 flex flex-col items-center gap-5">
      <Spinner size="lg" />
      <div className="text-center">
        <p className="font-medium text-gray-800">
          {STATUS_MESSAGES[status] || 'Processing...'}
        </p>
        <p className="text-sm text-gray-400 mt-1">This usually takes 1–3 seconds</p>
      </div>
    </div>
  )
}

export default StatusPoller
