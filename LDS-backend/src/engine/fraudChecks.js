const T = require('./thresholds')
const MAX_FRAUD_SCORE = T.SCORE_MAX * T.FRAUD_WEIGHT // 85

const runFraudChecks = ({ ownerName, businessType, monthlyRevenue, loanAmount, purpose }) => {
  let deductions = 0
  const reasonCodes = []

  // Check 1: Suspiciously round revenue (>500k and divisible by 100k)
  if (monthlyRevenue > 500000 && monthlyRevenue % 100000 === 0) {
    deductions += 25
    reasonCodes.push('SUSPICIOUS_REVENUE_AMOUNT')
  }

  // Check 2: Large business requesting a tiny loan (revenue inflation signal)
  if (monthlyRevenue > 1000000 && loanAmount < 10000) {
    deductions += 25
    reasonCodes.push('LOW_LOAN_AMOUNT_ANOMALY')
  }

  // Check 3: Private Limited with single-word owner name
  if (businessType === 'PRIVATE_LIMITED' && ownerName && !ownerName.trim().includes(' ')) {
    deductions += 20
    reasonCodes.push('DATA_INCONSISTENCY')
  }

  // Check 4: Equipment loan disproportionately large vs. revenue
  if (purpose === 'EQUIPMENT' && loanAmount > monthlyRevenue * 24) {
    deductions += 15
    reasonCodes.push('DATA_INCONSISTENCY')
  }

  return {
    score: Math.max(0, MAX_FRAUD_SCORE - deductions),
    reasonCodes: [...new Set(reasonCodes)],
  }
}

module.exports = { runFraudChecks }
