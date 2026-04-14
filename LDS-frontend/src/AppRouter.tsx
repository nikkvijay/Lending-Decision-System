import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Application    from './pages/Application/Application'
import LoginPage      from './pages/Login/LoginPage'
import AdminPanel     from './pages/Admin/AdminPanel'
import SuperAdminPanel from './pages/SuperAdmin/SuperAdminPanel'
import ProtectedRoute from './components/shared/ProtectedRoute'
import NotFound       from './pages/NotFound'

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"      element={<Application />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <SuperAdminPanel />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter
