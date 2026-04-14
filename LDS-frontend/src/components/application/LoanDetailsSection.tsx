import FormField from './FormField'

interface Props {
  formData: Record<string, string>
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

const TENURES = [
  { value: '6', label: '6 months' },
  { value: '12', label: '12 months' },
  { value: '18', label: '18 months' },
  { value: '24', label: '24 months' },
  { value: '36', label: '36 months' },
  { value: '48', label: '48 months' },
  { value: '60', label: '60 months' },
]

const PURPOSES = [
  { value: 'WORKING_CAPITAL', label: 'Working Capital' },
  { value: 'EQUIPMENT', label: 'Equipment Purchase' },
  { value: 'EXPANSION', label: 'Business Expansion' },
  { value: 'INVENTORY', label: 'Inventory' },
  { value: 'OTHER', label: 'Other' },
]

const inputClass =
  'w-full bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors'

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
        <select
          value={formData.tenureMonths}
          onChange={(e) => onChange('tenureMonths', e.target.value)}
          className={inputClass}
        >
          <option value="">Select tenure</option>
          {TENURES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </FormField>
    </div>

    <FormField label="Purpose of Loan" required error={errors.purpose}>
      <select
        value={formData.purpose}
        onChange={(e) => onChange('purpose', e.target.value)}
        className={inputClass}
      >
        <option value="">Select purpose</option>
        {PURPOSES.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
    </FormField>
  </div>
)

export default LoanDetailsSection
