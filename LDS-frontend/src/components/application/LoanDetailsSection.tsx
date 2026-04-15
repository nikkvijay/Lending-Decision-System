import type { ReactNode } from 'react'
import FormField from './FormField'

interface Props {
  formData: Record<string, string>
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

const TENURES = [
  { value: '6',  label: '6 months' },
  { value: '12', label: '12 months' },
  { value: '18', label: '18 months' },
  { value: '24', label: '24 months' },
  { value: '36', label: '36 months' },
  { value: '48', label: '48 months' },
  { value: '60', label: '60 months' },
]

const PURPOSES = [
  { value: 'WORKING_CAPITAL', label: 'Working Capital' },
  { value: 'EQUIPMENT',       label: 'Equipment Purchase' },
  { value: 'EXPANSION',       label: 'Business Expansion' },
  { value: 'INVENTORY',       label: 'Inventory' },
  { value: 'OTHER',           label: 'Other' },
]

const inputClass =
  'w-full bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none'

const selectClass =
  'w-full appearance-none bg-white border border-neutral-200 rounded-lg px-3 py-2.5 pr-9 text-sm text-neutral-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none cursor-pointer'

const ChevronIcon = () => (
  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
    <svg className="w-4 h-4 text-neutral-400" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  </div>
)

const SelectWrap = ({ children }: { children: ReactNode }) => (
  <div className="relative">{children}<ChevronIcon /></div>
)

const LoanDetailsSection = ({ formData, onChange, errors }: Props) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-sm font-semibold text-neutral-900">Loan Details</h2>
      <p className="text-xs text-neutral-400 mt-0.5">Amount and repayment terms</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <FormField label="Loan Amount (₹)" required error={errors.amount}>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => onChange('amount', e.target.value)}
          placeholder="500000"
          min={10000}
          className={inputClass}
        />
      </FormField>

      <FormField label="Repayment Tenure" required error={errors.tenureMonths}>
        <SelectWrap>
          <select
            value={formData.tenureMonths}
            onChange={(e) => onChange('tenureMonths', e.target.value)}
            className={selectClass}
          >
            <option value="">Select tenure</option>
            {TENURES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </SelectWrap>
      </FormField>
    </div>

    <FormField label="Purpose of Loan" required error={errors.purpose}>
      <SelectWrap>
        <select
          value={formData.purpose}
          onChange={(e) => onChange('purpose', e.target.value)}
          className={selectClass}
        >
          <option value="">Select purpose</option>
          {PURPOSES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </SelectWrap>
    </FormField>
  </div>
)

export default LoanDetailsSection
