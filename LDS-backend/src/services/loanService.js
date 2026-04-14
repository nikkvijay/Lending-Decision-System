const { pool } = require('../config/postgres')
const auditService = require('./auditService')

const createLoan = async (data) => {
  const { profileId, amount, tenureMonths, purpose } = data

  const profile = await pool.query('SELECT id FROM business_profiles WHERE id = $1', [profileId])
  if (!profile.rows[0]) {
    const err = new Error('Profile not found')
    err.statusCode = 404
    err.code = 'PROFILE_NOT_FOUND'
    throw err
  }

  const result = await pool.query(
    `INSERT INTO loan_applications (profile_id, amount, tenure_months, purpose)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [profileId, amount, tenureMonths, purpose]
  )

  const l = result.rows[0]
  await auditService.log({
    event_type: 'LOAN_SUBMITTED',
    entity_type: 'loan',
    entity_id: l.id,
    metadata: { amount, tenureMonths, purpose },
  })

  return formatLoan(l)
}

const getLoanById = async (id) => {
  const result = await pool.query('SELECT * FROM loan_applications WHERE id = $1', [id])
  if (!result.rows[0]) return null
  return formatLoan(result.rows[0])
}

const formatLoan = (l) => ({
  loanId:       l.id,
  profileId:    l.profile_id,
  amount:       l.amount,
  tenureMonths: l.tenure_months,
  purpose:      l.purpose,
  status:       l.status,
  createdAt:    l.created_at,
})

module.exports = { createLoan, getLoanById }
