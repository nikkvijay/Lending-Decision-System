import type { ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
  required?: boolean
  hint?: string
  error?: string
}

const FormField = ({ label, children, required, hint, error }: Props) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wider">
      {label}{required && <span className="text-neutral-900 ml-0.5">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-neutral-400">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

export default FormField
