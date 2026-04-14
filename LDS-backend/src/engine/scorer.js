const T = require('./thresholds')
const { scoreRevenueEMI, scoreLoanMultiple, scoreTenure, scoreBusinessType } = require('./rules')
const { runFraudChecks } = require('./fraudChecks')

const assembleScore = (input) => {
  const { ownerName, businessType, monthlyRevenue, loanAmount, tenureMonths, purpose } = input

  const emiResult          = scoreRevenueEMI(monthlyRevenue, loanAmount, tenureMonths)
  const multipleResult     = scoreLoanMultiple(loanAmount, monthlyRevenue)
  const tenureResult       = scoreTenure(tenureMonths)
  const businessTypeResult = scoreBusinessType(businessType)
  const fraudResult        = runFraudChecks({ ownerName, businessType, monthlyRevenue, loanAmount, purpose })

  const rawScore = (
    emiResult.score +
    multipleResult.score +
    tenureResult.score +
    businessTypeResult.score +
    fraudResult.score
  )

  const normalizedScore = Math.round(T.SCORE_MIN + (rawScore / T.SCORE_MAX) * T.SCORE_RANGE)

  const hardFail = emiResult.hardFail || multipleResult.hardFail

  const allReasonCodes = [
    ...emiResult.reasonCodes,
    ...multipleResult.reasonCodes,
    ...fraudResult.reasonCodes,
  ]

  // Add LOW_REVENUE advisory if borderline but not already flagged
  if (!hardFail && emiResult.ratio < 2.5 && !allReasonCodes.includes('POOR_EMI_RATIO')) {
    allReasonCodes.push('LOW_REVENUE')
  }

  return {
    creditScore: normalizedScore,
    hardFail,
    reasonCodes: [...new Set(allReasonCodes)],
    scoringBreakdown: {
      revenue_emi_ratio:   emiResult.ratio,
      revenue_emi_score:   emiResult.score,
      loan_multiple:       multipleResult.multiple,
      loan_multiple_score: multipleResult.score,
      tenure_score:        tenureResult.score,
      business_type_score: businessTypeResult.score,
      fraud_score:         fraudResult.score,
      raw_score:           rawScore,
      final_score:         normalizedScore,
    },
  }
}

module.exports = { assembleScore }
