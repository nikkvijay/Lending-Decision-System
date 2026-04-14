const T = require('./thresholds')

// EMI using standard reducing-balance formula
const calculateEMI = (principal, tenureMonths) => {
  const r = T.MONTHLY_INTEREST_RATE
  const n = tenureMonths
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// Component 1: Revenue-to-EMI Ratio (35% weight, max 297.5 pts)
const scoreRevenueEMI = (monthlyRevenue, loanAmount, tenureMonths) => {
  const emi = calculateEMI(loanAmount, tenureMonths)
  const ratio = monthlyRevenue / emi
  const max = T.SCORE_MAX * T.EMI_RATIO_WEIGHT

  let score
  const reasonCodes = []
  let hardFail = false

  if (ratio >= T.EMI_RATIO_EXCELLENT)   score = max
  else if (ratio >= T.EMI_RATIO_GOOD)   score = max * 0.80
  else if (ratio >= T.EMI_RATIO_ACCEPTABLE) score = max * 0.60
  else if (ratio >= T.EMI_RATIO_RISKY)  score = max * 0.40
  else if (ratio >= T.EMI_RATIO_HARD_FAIL) score = max * 0.20
  else {
    score = 0
    hardFail = true
    reasonCodes.push('POOR_EMI_RATIO')
  }

  return { score, ratio, emi, reasonCodes, hardFail }
}

// Component 2: Loan Amount as Multiple of Revenue (30% weight, max 255 pts)
const scoreLoanMultiple = (loanAmount, monthlyRevenue) => {
  const multiple = loanAmount / monthlyRevenue
  const max = T.SCORE_MAX * T.LOAN_MULTIPLE_WEIGHT

  let score
  const reasonCodes = []
  let hardFail = false

  if (multiple <= T.LOAN_MULTIPLE_VERY_SAFE) score = max
  else if (multiple <= T.LOAN_MULTIPLE_SAFE) score = max * 0.80
  else if (multiple <= T.LOAN_MULTIPLE_MODERATE) score = max * 0.60
  else if (multiple <= T.LOAN_MULTIPLE_ELEVATED) score = max * 0.40
  else if (multiple <= T.LOAN_MULTIPLE_HIGH_RISK) {
    score = max * 0.20
    reasonCodes.push('HIGH_LOAN_RATIO')
  } else {
    score = 0
    hardFail = true
    reasonCodes.push('HIGH_LOAN_RATIO')
  }

  return { score, multiple, reasonCodes, hardFail }
}

// Component 3: Tenure Risk (15% weight, max 127.5 pts)
const scoreTenure = (tenureMonths) => {
  const max = T.SCORE_MAX * T.TENURE_WEIGHT
  let score

  if (tenureMonths <= 12)      score = max
  else if (tenureMonths <= 24) score = max * 0.80
  else if (tenureMonths <= 36) score = max * 0.60
  else if (tenureMonths <= 48) score = max * 0.40
  else                         score = max * 0.20

  return { score }
}

// Component 4: Business Type Risk (10% weight, max 85 pts)
const scoreBusinessType = (businessType) => {
  const max = T.SCORE_MAX * T.BUSINESS_TYPE_WEIGHT
  const scores = {
    PRIVATE_LIMITED:     max,
    LLP:                 max * 0.85,
    PARTNERSHIP:         max * 0.70,
    SOLE_PROPRIETORSHIP: max * 0.50,
  }
  return { score: scores[businessType] ?? max * 0.50 }
}

module.exports = { calculateEMI, scoreRevenueEMI, scoreLoanMultiple, scoreTenure, scoreBusinessType }
