import FormField from './FormField'

interface Props {
  formData: Record<string, string>
  onChange: (field: string, value: string) => void
}

const BUSINESS_TYPES = [
  { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'PRIVATE_LIMITED', label: 'Private Limited' },
  { value: 'LLP', label: 'LLP' },
]

const inputClass =
  'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900'

const BusinessProfileSection = ({ formData, onChange }: Props) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-800">Business Profile</h2>

    <FormField label="Owner Name" required>
      <input
        type="text"
        value={formData.ownerName}
        onChange={(e) => onChange('ownerName', e.target.value)}
        placeholder="Full name of business owner"
        className={inputClass}
        required
      />
    </FormField>

    <FormField label="PAN" required hint="Format: ABCDE1234F">
      <input
        type="text"
        value={formData.pan}
        onChange={(e) => onChange('pan', e.target.value.toUpperCase())}
        placeholder="ABCDE1234F"
        maxLength={10}
        className={inputClass}
        required
      />
    </FormField>

    <FormField label="Business Name" required>
      <input
        type="text"
        value={formData.businessName}
        onChange={(e) => onChange('businessName', e.target.value)}
        placeholder="Registered business name"
        className={inputClass}
        required
      />
    </FormField>

    <FormField label="Business Type" required>
      <select
        value={formData.businessType}
        onChange={(e) => onChange('businessType', e.target.value)}
        className={inputClass}
        required
      >
        <option value="">Select business type</option>
        {BUSINESS_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>
    </FormField>

    <FormField label="Monthly Revenue (₹)" required>
      <input
        type="number"
        value={formData.monthlyRevenue}
        onChange={(e) => onChange('monthlyRevenue', e.target.value)}
        placeholder="e.g. 150000"
        min={1000}
        className={inputClass}
        required
      />
    </FormField>
  </div>
)

export default BusinessProfileSection
