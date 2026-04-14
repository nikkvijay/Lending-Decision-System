import FormField from './FormField'

interface Props {
  formData: Record<string, string>
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

const BUSINESS_TYPES = [
  { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship' },
  { value: 'PARTNERSHIP', label: 'Partnership' },
  { value: 'PRIVATE_LIMITED', label: 'Private Limited' },
  { value: 'LLP', label: 'LLP' },
]

const inputClass =
  'w-full bg-white border border-neutral-200 rounded-lg px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 transition-colors'

const BusinessProfileSection = ({ formData, onChange, errors }: Props) => (
  <div className="space-y-4">
    <div>
      <h2 className="text-sm font-semibold text-neutral-900">Business Profile</h2>
      <p className="text-xs text-neutral-400 mt-0.5">Owner and business details</p>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <FormField label="Owner Name" required error={errors.ownerName}>
        <input
          type="text"
          value={formData.ownerName}
          onChange={(e) => onChange('ownerName', e.target.value)}
          placeholder="Rajesh Kumar"
          className={inputClass}
        />
      </FormField>

      <FormField label="PAN" required hint="ABCDE1234F" error={errors.pan}>
        <input
          type="text"
          value={formData.pan}
          onChange={(e) => onChange('pan', e.target.value.toUpperCase())}
          placeholder="ABCDE1234F"
          maxLength={10}
          autoComplete="off"
          className={inputClass}
        />
      </FormField>
    </div>

    <FormField label="Business Name" required error={errors.businessName}>
      <input
        type="text"
        value={formData.businessName}
        onChange={(e) => onChange('businessName', e.target.value)}
        placeholder="Kumar Traders Pvt. Ltd."
        className={inputClass}
      />
    </FormField>

    <div className="grid grid-cols-2 gap-4">
      <FormField label="Business Type" required error={errors.businessType}>
        <select
          value={formData.businessType}
          onChange={(e) => onChange('businessType', e.target.value)}
          className={inputClass}
        >
          <option value="">Select type</option>
          {BUSINESS_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Monthly Revenue (₹)" required error={errors.monthlyRevenue}>
        <input
          type="number"
          value={formData.monthlyRevenue}
          onChange={(e) => onChange('monthlyRevenue', e.target.value)}
          placeholder="150000"
          min={1000}
          className={inputClass}
        />
      </FormField>
    </div>
  </div>
)

export default BusinessProfileSection
