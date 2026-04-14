const { assembleScore } = require('./scorer')
const T = require('./thresholds')

/**
 * Main decision engine entry point.
 * Pure function — no side effects, no DB calls.
 *
 * @param {{ ownerName, businessType, monthlyRevenue, loanAmount, tenureMonths, purpose }} input
 * @returns {{ decision, creditScore, reasonCodes, scoringBreakdown }}
 */
const runDecisionEngine = (input) => {
  const { creditScore, hardFail, reasonCodes, scoringBreakdown } = assembleScore(input)

  let decision
  if (hardFail)                        decision = 'REJECTED'
  else if (creditScore >= T.APPROVAL_THRESHOLD) decision = 'APPROVED'
  else                                 decision = 'REJECTED'

  return {
    decision,
    creditScore,
    // Return empty reason codes on approval
    reasonCodes: decision === 'APPROVED' ? [] : reasonCodes,
    scoringBreakdown,
  }
}

module.exports = runDecisionEngine
