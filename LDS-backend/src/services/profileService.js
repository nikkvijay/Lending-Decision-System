const { pool } = require('../config/postgres')
const { maskPAN, hashPAN } = require('../utils/cryptoUtils')
const auditService = require('./auditService')

const createProfile = async (data, createdBy = 'system') => {
  const { ownerName, pan, businessName, businessType, monthlyRevenue } = data

  const panHash = hashPAN(pan)
  const existing = await pool.query(
    'SELECT id FROM business_profiles WHERE pan_hash = $1 AND is_deleted = FALSE',
    [panHash]
  )
  if (existing.rows.length > 0) {
    const err = new Error('A profile with this PAN already exists')
    err.statusCode = 409
    err.code = 'DUPLICATE_PAN'
    throw err
  }

  const result = await pool.query(
    `INSERT INTO business_profiles
       (owner_name, pan, pan_hash, business_name, business_type, monthly_revenue, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [ownerName.trim(), maskPAN(pan), panHash, businessName.trim(), businessType, monthlyRevenue, createdBy]
  )

  const p = result.rows[0]
  await auditService.log({
    event_type: 'PROFILE_CREATED',
    entity_type: 'profile',
    entity_id: p.id,
    metadata: { businessType, createdBy },
  })

  return formatProfile(p)
}

const getProfileById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM business_profiles WHERE id = $1 AND is_deleted = FALSE',
    [id]
  )
  if (!result.rows[0]) return null
  return formatProfile(result.rows[0])
}

// Soft delete — marks is_deleted, sets deleted_at and updated_by
const softDeleteProfile = async (id, deletedBy = 'system') => {
  const result = await pool.query(
    `UPDATE business_profiles
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

// Hard delete — physically removes the row (and cascades to loans/decisions via DB constraints)
const hardDeleteProfile = async (id) => {
  const result = await pool.query(
    'DELETE FROM business_profiles WHERE id = $1 RETURNING id',
    [id]
  )
  return result.rowCount > 0
}

const formatProfile = (p) => ({
  profileId:      p.id,
  ownerName:      p.owner_name,
  pan:            p.pan,
  businessName:   p.business_name,
  businessType:   p.business_type,
  monthlyRevenue: p.monthly_revenue,
  createdBy:      p.created_by,
  updatedBy:      p.updated_by || null,
  isDeleted:      p.is_deleted,
  deletedAt:      p.deleted_at || null,
  createdAt:      p.created_at,
  updatedAt:      p.updated_at,
})

module.exports = { createProfile, getProfileById, softDeleteProfile, hardDeleteProfile }
