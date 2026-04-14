module.exports = {
  MONTHLY_INTEREST_RATE: 0.015, // 18% annual / 12

  // Component weights (must sum to 1.0)
  EMI_RATIO_WEIGHT:      0.35,
  LOAN_MULTIPLE_WEIGHT:  0.30,
  TENURE_WEIGHT:         0.15,
  BUSINESS_TYPE_WEIGHT:  0.10,
  FRAUD_WEIGHT:          0.10,

  // Revenue-to-EMI ratio bands
  EMI_RATIO_EXCELLENT:   5.0,
  EMI_RATIO_GOOD:        3.0,
  EMI_RATIO_ACCEPTABLE:  2.0,
  EMI_RATIO_RISKY:       1.5,
  EMI_RATIO_HARD_FAIL:   1.2,

  // Loan multiple bands
  LOAN_MULTIPLE_VERY_SAFE:  6,
  LOAN_MULTIPLE_SAFE:       10,
  LOAN_MULTIPLE_MODERATE:   18,
  LOAN_MULTIPLE_ELEVATED:   24,
  LOAN_MULTIPLE_HIGH_RISK:  36,

  // Score range (FICO-inspired: 300–850)
  SCORE_MIN:          300,
  SCORE_MAX:          850,
  SCORE_RANGE:        550,
  APPROVAL_THRESHOLD: 650,
}
