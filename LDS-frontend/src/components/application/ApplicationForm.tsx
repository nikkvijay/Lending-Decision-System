import { useState } from 'react'
import { useSubmitApplication } from '@/hooks/useSubmitApplication'
import BusinessProfileSection from './BusinessProfileSection'
import LoanDetailsSection from './LoanDetailsSection'

const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/

const ApplicationForm = () => {
  const { submit, loading, error } = useSubmitApplication()
  const [formData, setFormData] = useState({
    ownerName: '', pan: '', businessName: '', businessType: '',
    monthlyRevenue: '', amount: '', tenureMonths: '', purpose: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.ownerName.trim()) e.ownerName = 'Required'
    if (!PAN_REGEX.test(formData.pan)) e.pan = 'Format: ABCDE1234F'
    if (!formData.businessName.trim()) e.businessName = 'Required'
    if (!formData.businessType) e.businessType = 'Required'
    if (!formData.monthlyRevenue || Number(formData.monthlyRevenue) < 1000)
      e.monthlyRevenue = 'Min ₹1,000'
    if (!formData.amount || Number(formData.amount) < 10000)
      e.amount = 'Min ₹10,000'
    if (!formData.tenureMonths) e.tenureMonths = 'Required'
    if (!formData.purpose) e.purpose = 'Required'
    return e
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    submit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
        <BusinessProfileSection formData={formData} onChange={handleChange} errors={errors} />
        <div className="border-t border-neutral-100" />
        <LoanDetailsSection formData={formData} onChange={handleChange} errors={errors} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-neutral-900 text-white text-sm font-medium py-3 rounded-lg hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}

export default ApplicationForm
