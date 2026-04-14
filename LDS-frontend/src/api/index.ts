import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || 'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

// --- Profile ---
export const createProfile = (data: {
  ownerName: string
  pan: string
  businessName: string
  businessType: string
  monthlyRevenue: number
}) => api.post('/profiles', data)

// --- Loan ---
export const createLoan = (data: {
  profileId: string
  amount: number
  tenureMonths: number
  purpose: string
}) => api.post('/loans', data)

// --- Decision ---
export const triggerDecision = (data: { loanId: string }) =>
  api.post('/decisions', data)

export const getDecisionStatus = (jobId: string) =>
  api.get(`/decisions/${jobId}/status`)

export default api
