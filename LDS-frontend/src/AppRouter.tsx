import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Application from './pages/Application/Application'
import NotFound from './pages/NotFound'

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Application />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
