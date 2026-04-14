const Navbar = () => (
  <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
    <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-blue-600" />
        <span className="text-sm font-semibold tracking-tight text-neutral-900">
          Lending Decision System
        </span>
      </div>
      <span className="text-xs text-neutral-400 font-medium">MSME Credit</span>
    </div>
  </header>
)

export default Navbar
