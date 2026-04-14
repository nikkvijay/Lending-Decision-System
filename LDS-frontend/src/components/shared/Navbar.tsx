import { Link, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  { path: '/',           label: 'Apply' },
  { path: '/admin',      label: 'Admin' },
  { path: '/superadmin', label: 'Super Admin' },
]

const Navbar = () => {
  const { pathname } = useLocation()

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-blue-600" />
          <span className="text-sm font-semibold tracking-tight text-neutral-900">Vitto LDS</span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                pathname === path
                  ? 'bg-blue-600 text-white'
                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
