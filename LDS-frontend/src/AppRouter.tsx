import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Application from './pages/Application/Application'
import AdminPanel from './pages/Admin/AdminPanel'
import SuperAdminPanel from './pages/SuperAdmin/SuperAdminPanel'
import NotFound from './pages/NotFound'

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/"           element={<Application />} />
      <Route path="/admin"      element={<AdminPanel />} />
      <Route path="/superadmin" element={<SuperAdminPanel />} />
      <Route path="*"           element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default AppRouter
