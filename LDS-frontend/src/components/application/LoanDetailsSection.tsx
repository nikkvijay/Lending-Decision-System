import FormField from './FormField'

interface Props {
  formData: Record<string, string>
  onChange: (field: string, value: string) => void
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
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'

const LoanDetailsSection = ({ formData, onChange }: Props) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-800">Loan Details</h2>

    <FormField label="Loan Amount (₹)" required>
      <input
        type="number"
        value={formData.amount}
        onChange={(e) => onChange('amount', e.target.value)}
        placeholder="e.g. 500000"
        min={10000}
        className={inputClass}
        required
      />
    </FormField>

    <FormField label="Repayment Tenure" required>
      <select
        value={formData.tenureMonths}
        onChange={(e) => onChange('tenureMonths', e.target.value)}
        className={inputClass}
        required
      >
        <option value="">Select tenure</option>
        {TENURES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </FormField>

    <FormField label="Purpose of Loan" required>
      <select
        value={formData.purpose}
        onChange={(e) => onChange('purpose', e.target.value)}
        className={inputClass}
        required
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
