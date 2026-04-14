import { useEffect, useRef } from 'react'
import { getDecisionStatus } from '@/api'
import { useApplication } from '@/contexts/ApplicationContext'

const POLL_INTERVALS = [1000, 1500, 2000, 2500, 3000, 4000, 5000]
const MAX_POLL_DURATION = 30000

export const useDecisionPoller = () => {
  const { jobId, status, setStatus, setDecisionResult } = useApplication()
  const attemptRef = useRef(0)
  const startTimeRef = useRef<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!jobId || status === 'COMPLETED' || status === 'FAILED' || status === 'IDLE') return

    startTimeRef.current = Date.now()
    attemptRef.current = 0

    const poll = async () => {
      if (Date.now() - (startTimeRef.current || 0) > MAX_POLL_DURATION) {
        setStatus('TIMEOUT')
        return
      }

      try {
        const res = await getDecisionStatus(jobId)
        const data = res.data.data

        if (data.status === 'COMPLETED' || data.status === 'FAILED') {
          setDecisionResult(data)
          setStatus(data.status)
          return
        }

        setStatus(data.status)
        const delay = POLL_INTERVALS[Math.min(attemptRef.current, POLL_INTERVALS.length - 1)]
        attemptRef.current++
        timerRef.current = setTimeout(poll, delay)
      } catch {
        const delay = POLL_INTERVALS[Math.min(attemptRef.current, POLL_INTERVALS.length - 1)]
        attemptRef.current++
        timerRef.current = setTimeout(poll, delay)
      }
    }

    poll()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [jobId])
}
