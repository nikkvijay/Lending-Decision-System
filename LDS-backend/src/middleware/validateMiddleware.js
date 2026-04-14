const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
const BUSINESS_TYPES = ['SOLE_PROPRIETORSHIP', 'PARTNERSHIP', 'PRIVATE_LIMITED', 'LLP']
const PURPOSES = ['WORKING_CAPITAL', 'EQUIPMENT', 'EXPANSION', 'INVENTORY', 'OTHER']
const VALID_TENURES = [6, 12, 18, 24, 36, 48, 60]

const sendValidationError = (res, details) => {
  res.status(400).json({
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details,
      timestamp: new Date().toISOString(),
    },
  })
}

const validateProfile = (req, res, next) => {
  const { ownerName, pan, businessName, businessType, monthlyRevenue } = req.body
  const errors = []

  if (!ownerName || ownerName.trim().length < 2)
    errors.push({ field: 'ownerName', message: 'Owner name must be at least 2 characters' })
  if (!pan || !PAN_REGEX.test(pan))
    errors.push({ field: 'pan', message: 'PAN must match format AAAAA9999A' })
  if (!businessName || businessName.trim().length < 2)
    errors.push({ field: 'businessName', message: 'Business name must be at least 2 characters' })
  if (!BUSINESS_TYPES.includes(businessType))
    errors.push({ field: 'businessType', message: `Must be one of: ${BUSINESS_TYPES.join(', ')}` })
  if (!monthlyRevenue || isNaN(monthlyRevenue) || Number(monthlyRevenue) < 1000)
    errors.push({ field: 'monthlyRevenue', message: 'Monthly revenue must be a number >= 1000' })

  if (errors.length > 0) return sendValidationError(res, errors)
  next()
}

const validateLoan = (req, res, next) => {
  const { profileId, amount, tenureMonths, purpose } = req.body
  const errors = []

  if (!profileId)
    errors.push({ field: 'profileId', message: 'profileId is required' })
  if (!amount || isNaN(amount) || Number(amount) < 10000)
    errors.push({ field: 'amount', message: 'Loan amount must be >= 10,000' })
  if (!VALID_TENURES.includes(Number(tenureMonths)))
    errors.push({ field: 'tenureMonths', message: `Must be one of: ${VALID_TENURES.join(', ')}` })
  if (!PURPOSES.includes(purpose))
    errors.push({ field: 'purpose', message: `Must be one of: ${PURPOSES.join(', ')}` })

  if (errors.length > 0) return sendValidationError(res, errors)
  next()
}

const validateDecision = (req, res, next) => {
  const { loanId } = req.body
  if (!loanId)
    return sendValidationError(res, [{ field: 'loanId', message: 'loanId is required' }])
  next()
}

module.exports = { validateProfile, validateLoan, validateDecision }
