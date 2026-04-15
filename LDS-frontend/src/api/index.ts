import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT token on every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lds_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error?.message || 'Something went wrong'
    
    if (error.response?.status === 401) {
      localStorage.removeItem('lds_token')
      localStorage.removeItem('lds_user')
    }
    return Promise.reject(new Error(message))
  }
)

// --- Auth ---
export const loginUser = (data: { username: string; password: string }) =>
  api.post('/auth/login', data)

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

// --- Admin ---
export const getAdminApplications = (filter = 'ALL') =>
  api.get(`/admin/applications?filter=${filter}`)

export const getAdminStats = () => api.get('/admin/stats')

export const getAdminAuditLogs = (limit = 50) =>
  api.get(`/admin/audit-logs?limit=${limit}`)

export default api
