import { ReactNode } from 'react'
import FormField from './FormField'

interface Props {
  formData: Record<string, string>
  onChange: (field: string, value: string) => void
  errors: Record<string, string>
}

const BUSINESS_TYPES = [
  { value: 'SOLE_PROPRIETORSHIP', label: 'Sole Proprietorship' },
  { value: 'PARTNERSHIP',         label: 'Partnership' },
  { value: 'PRIVATE_LIMITED',     label: 'Private Limited' },
  { value: 'LLP',                 label: 'LLP' },
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

      <FormField label="PAN" required hint="Format: ABCDE1234F" error={errors.pan}>
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
        <SelectWrap>
          <select
            value={formData.businessType}
            onChange={(e) => onChange('businessType', e.target.value)}
            className={selectClass}
          >
            <option value="">Select type</option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </SelectWrap>
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
