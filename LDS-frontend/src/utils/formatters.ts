export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export const getScoreColor = (score: number): string => {
  if (score >= 650) return '#10b981'
  if (score >= 500) return '#f59e0b'
  return '#ef4444'
}

export const getScoreLabel = (score: number): string => {
  if (score >= 750) return 'Excellent'
  if (score >= 650) return 'Good'
  if (score >= 500) return 'Fair'
  return 'Poor'
}

export const REASON_CODE_LABELS: Record<string, { title: string; description: string }> = {
  LOW_REVENUE: {
    title: 'Insufficient Revenue',
    description: 'Monthly revenue is too low relative to the requested loan amount.',
  },
  HIGH_LOAN_RATIO: {
    title: 'High Loan-to-Revenue Ratio',
    description: 'The requested loan amount significantly exceeds typical multiples of monthly revenue.',
  },
  POOR_EMI_RATIO: {
    title: 'EMI Exceeds Repayment Capacity',
    description: 'Monthly EMI would exceed a safe proportion of monthly revenue.',
  },
  EXCESSIVE_TENURE: {
    title: 'Extended Repayment Period',
    description: 'The selected tenure increases overall risk exposure.',
  },
  HIGH_RISK_BUSINESS_TYPE: {
    title: 'Business Structure Risk',
    description: 'This business type carries higher credit risk.',
  },
  DATA_INCONSISTENCY: {
    title: 'Data Inconsistency Detected',
    description: 'Some provided information appears inconsistent and requires review.',
  },
  SUSPICIOUS_REVENUE_AMOUNT: {
    title: 'Revenue Verification Required',
    description: 'Declared revenue has characteristics that require additional verification.',
  },
  LOW_LOAN_AMOUNT_ANOMALY: {
    title: 'Loan Amount Anomaly',
    description: 'The requested loan amount is unusually low relative to declared business scale.',
  },
}
