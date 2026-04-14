import { Navigate } from 'react-router-dom'

interface Props {
  children: React.ReactNode
  requiredRole: 'admin' | 'superadmin'
}

const getStoredUser = (): { role: string } | null => {
  try {
    const raw = localStorage.getItem('lds_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const ProtectedRoute = ({ children, requiredRole }: Props) => {
  const token = localStorage.getItem('lds_token')
  const user  = getStoredUser()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // superadmin can access everything; admin cannot access superadmin-only routes
  if (requiredRole === 'superadmin' && user.role !== 'superadmin') {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}

export default ProtectedRoute
