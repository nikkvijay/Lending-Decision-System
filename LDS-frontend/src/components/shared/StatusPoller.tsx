import { useApplication } from '@/contexts/ApplicationContext'

const StatusPoller = () => {
  const { status } = useApplication()

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-10 flex flex-col items-center gap-5">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-neutral-900 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-neutral-900">
          {status === 'PROCESSING' ? 'Analysing application' : 'Queued for review'}
        </p>
        <p className="text-xs text-neutral-400 mt-1">Usually takes 1–3 seconds</p>
      </div>
    </div>
  )
}

export default StatusPoller
