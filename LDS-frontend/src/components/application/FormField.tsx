import { ReactNode } from 'react'

interface Props {
  label: string
  children: ReactNode
  required?: boolean
  hint?: string
}

const FormField = ({ label, children, required, hint }: Props) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-gray-400">{hint}</p>}
  </div>
)

export default FormField
