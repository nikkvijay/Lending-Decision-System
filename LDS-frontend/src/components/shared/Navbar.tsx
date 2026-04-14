const Navbar = () => (
  <header className="border-b border-neutral-200 bg-white">
    <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-2 h-2 rounded-full bg-neutral-900" />
        <span className="text-sm font-semibold tracking-tight text-neutral-900">
          Vitto LDS
        </span>
      </div>
      <span className="text-xs text-neutral-400 font-medium">
        MSME Credit
      </span>
    </div>
  </header>
)

export default Navbar
