const { pool } = require('../config/postgres')
const auditService = require('./auditService')

const createLoan = async (data, createdBy = 'system') => {
  const { profileId, amount, tenureMonths, purpose } = data

  const profile = await pool.query(
    'SELECT id FROM business_profiles WHERE id = $1 AND is_deleted = FALSE',
    [profileId]
  )
  if (!profile.rows[0]) {
    const err = new Error('Profile not found')
    err.statusCode = 404
    err.code = 'PROFILE_NOT_FOUND'
    throw err
  }

  const result = await pool.query(
    `INSERT INTO loan_applications (profile_id, amount, tenure_months, purpose, created_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [profileId, amount, tenureMonths, purpose, createdBy]
  )

  const l = result.rows[0]
  await auditService.log({
    event_type: 'LOAN_SUBMITTED',
    entity_type: 'loan',
    entity_id: l.id,
    metadata: { amount, tenureMonths, purpose, createdBy },
  })

  return formatLoan(l)
}

const getLoanById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM loan_applications WHERE id = $1 AND is_deleted = FALSE',
    [id]
  )
  if (!result.rows[0]) return null
  return formatLoan(result.rows[0])
}

// Soft delete — marks is_deleted, preserves the row for audit history
const softDeleteLoan = async (id, deletedBy = 'system') => {
  const result = await pool.query(
    `UPDATE loan_applications
     SET is_deleted = TRUE,
         deleted_at = NOW(),
         updated_by = $2,
         updated_at = NOW()
     WHERE id = $1 AND is_deleted = FALSE
     RETURNING id`,
    [id, deletedBy]
  )
  return result.rowCount > 0
}

// Hard delete — physically removes the row (decision_results deleted via cascade)
const hardDeleteLoan = async (id) => {
  const result = await pool.query(
    'DELETE FROM loan_applications WHERE id = $1 RETURNING id',
    [id]
  )
  return result.rowCount > 0
}

const formatLoan = (l) => ({
  loanId:       l.id,
  profileId:    l.profile_id,
  amount:       l.amount,
  tenureMonths: l.tenure_months,
  purpose:      l.purpose,
  status:       l.status,
  createdBy:    l.created_by,
  updatedBy:    l.updated_by || null,
  isDeleted:    l.is_deleted,
  deletedAt:    l.deleted_at || null,
  createdAt:    l.created_at,
  updatedAt:    l.updated_at,
})

module.exports = { createLoan, getLoanById, softDeleteLoan, hardDeleteLoan }
