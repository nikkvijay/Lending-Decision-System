import { useState } from 'react'
import { createProfile, createLoan, triggerDecision } from '@/api'
import { useApplication } from '@/contexts/ApplicationContext'

export interface FormData {
  ownerName: string
  pan: string
  businessName: string
  businessType: string
  monthlyRevenue: string
  amount: string
  tenureMonths: string
  purpose: string
}

export const useSubmitApplication = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setJobId, setStatus } = useApplication()

  const submit = async (formData: FormData) => {
    setLoading(true)
    setError(null)

    try {
      // Step 1: Create business profile
      const profileRes = await createProfile({
        ownerName: formData.ownerName,
        pan: formData.pan,
        businessName: formData.businessName,
        businessType: formData.businessType,
        monthlyRevenue: Number(formData.monthlyRevenue),
      })

      // Step 2: Submit loan application
      const loanRes = await createLoan({
        profileId: profileRes.data.data.profileId,
        amount: Number(formData.amount),
        tenureMonths: Number(formData.tenureMonths),
        purpose: formData.purpose,
      })

      // Step 3: Trigger decision engine
      const decisionRes = await triggerDecision({
        loanId: loanRes.data.data.loanId,
      })

      setJobId(decisionRes.data.data.jobId)
      setStatus('PENDING')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error }
}
