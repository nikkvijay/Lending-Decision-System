const { pool } = require('../config/postgres')
const { maskPAN, hashPAN } = require('../utils/cryptoUtils')
const auditService = require('./auditService')

const createProfile = async (data) => {
  const { ownerName, pan, businessName, businessType, monthlyRevenue } = data

  const panHash = hashPAN(pan)
  const existing = await pool.query(
    'SELECT id FROM business_profiles WHERE pan_hash = $1',
    [panHash]
  )
  if (existing.rows.length > 0) {
    const err = new Error('A profile with this PAN already exists')
    err.statusCode = 409
    err.code = 'DUPLICATE_PAN'
    throw err
  }

  const result = await pool.query(
    `INSERT INTO business_profiles (owner_name, pan, pan_hash, business_name, business_type, monthly_revenue)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [ownerName.trim(), maskPAN(pan), panHash, businessName.trim(), businessType, monthlyRevenue]
  )

  const p = result.rows[0]
  await auditService.log({
    event_type: 'PROFILE_CREATED',
    entity_type: 'profile',
    entity_id: p.id,
    metadata: { businessType },
  })

  return formatProfile(p)
}

const getProfileById = async (id) => {
  const result = await pool.query('SELECT * FROM business_profiles WHERE id = $1', [id])
  if (!result.rows[0]) return null
  return formatProfile(result.rows[0])
}

const formatProfile = (p) => ({
  profileId:      p.id,
  ownerName:      p.owner_name,
  pan:            p.pan,
  businessName:   p.business_name,
  businessType:   p.business_type,
  monthlyRevenue: p.monthly_revenue,
  createdAt:      p.created_at,
})

module.exports = { createProfile, getProfileById }
