import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

export interface DecisionResult {
  jobId: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  decision?: 'APPROVED' | 'REJECTED'
  creditScore?: number
  reasonCodes?: string[]
  decidedAt?: string
  loanId?: string
  processingMs?: number
}

interface ApplicationContextType {
  jobId: string | null
  status: string
  decisionResult: DecisionResult | null
  setJobId: (id: string) => void
  setStatus: (status: string) => void
  setDecisionResult: (result: DecisionResult) => void
  reset: () => void
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined)

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('IDLE')
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null)

  const reset = () => {
    setJobId(null)
    setStatus('IDLE')
    setDecisionResult(null)
  }

  return (
    <ApplicationContext.Provider
      value={{ jobId, status, decisionResult, setJobId, setStatus, setDecisionResult, reset }}
    >
      {children}
    </ApplicationContext.Provider>
  )
}

export const useApplication = () => {
  const ctx = useContext(ApplicationContext)
  if (!ctx) throw new Error('useApplication must be used within ApplicationProvider')
  return ctx
}
