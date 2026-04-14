import { useState } from 'react'
import { useSubmitApplication } from '@/hooks/useSubmitApplication'
import BusinessProfileSection from './BusinessProfileSection'
import LoanDetailsSection from './LoanDetailsSection'

const ApplicationForm = () => {
  const { submit, loading, error } = useSubmitApplication()
  const [formData, setFormData] = useState({
    ownerName: '',
    pan: '',
    businessName: '',
    businessType: '',
    monthlyRevenue: '',
    amount: '',
    tenureMonths: '',
    purpose: '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit(formData)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6"
    >
      <BusinessProfileSection formData={formData} onChange={handleChange} />
      <hr className="border-gray-100" />
      <LoanDetailsSection formData={formData} onChange={handleChange} />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}

export default ApplicationForm
