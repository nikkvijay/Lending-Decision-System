const { pool } = require('../config/postgres')
const AuditLog = require('../models/mongo/AuditLog')

const getApplications = async (filter = 'ALL') => {
  const base = 'WHERE bp.is_deleted = FALSE AND la.is_deleted = FALSE'
  const conditions = {
    ALL:      base,
    APPROVED: `${base} AND dr.decision = 'APPROVED'`,
    REJECTED: `${base} AND dr.decision = 'REJECTED'`,
    PENDING:  `${base} AND dr.status IN ('PENDING', 'PROCESSING')`,
  }
  const where = conditions[filter] || base

  const result = await pool.query(`
    SELECT
      dr.id           AS decision_id,
      dr.job_id,
      dr.status       AS decision_status,
      dr.decision,
      dr.credit_score,
      dr.reason_codes,
      dr.processing_ms,
      dr.decided_at,
      la.id           AS loan_id,
      la.amount,
      la.tenure_months,
      la.purpose,
      la.created_at   AS applied_at,
      bp.owner_name,
      bp.business_name,
      bp.business_type,
      bp.monthly_revenue,
      bp.pan
    FROM decision_results dr
    JOIN loan_applications la ON dr.loan_id = la.id
    JOIN business_profiles  bp ON la.profile_id = bp.id
    ${where}
    ORDER BY la.created_at DESC
    LIMIT 200
  `)

  return result.rows.map((r) => ({
    decisionId:    r.decision_id,
    jobId:         r.job_id,
    status:        r.decision_status,
    decision:      r.decision,
    creditScore:   r.credit_score ? parseInt(r.credit_score) : null,
    reasonCodes:   r.reason_codes || [],
    processingMs:  r.processing_ms,
    decidedAt:     r.decided_at,
    loanId:        r.loan_id,
    amount:        parseFloat(r.amount),
    tenureMonths:  r.tenure_months,
    purpose:       r.purpose,
    appliedAt:     r.applied_at,
    ownerName:     r.owner_name,
    businessName:  r.business_name,
    businessType:  r.business_type,
    monthlyRevenue: parseFloat(r.monthly_revenue),
    pan:           r.pan,
  }))
}

const getStats = async () => {
  const result = await pool.query(`
    SELECT
      COUNT(*)::int                                                              AS total,
      COUNT(CASE WHEN dr.decision = 'APPROVED' THEN 1 END)::int                AS approved,
      COUNT(CASE WHEN dr.decision = 'REJECTED' THEN 1 END)::int                AS rejected,
      COUNT(CASE WHEN dr.status IN ('PENDING','PROCESSING') THEN 1 END)::int   AS pending,
      ROUND(AVG(dr.credit_score))::int                                          AS avg_score,
      ROUND(
        COUNT(CASE WHEN dr.decision = 'APPROVED' THEN 1 END)::numeric /
        NULLIF(COUNT(CASE WHEN dr.decision IS NOT NULL THEN 1 END), 0) * 100, 1
      )::float                                                                   AS approval_rate,
      COUNT(CASE WHEN la.created_at >= NOW() - INTERVAL '24 hours' THEN 1 END)::int AS today
    FROM decision_results dr
    JOIN loan_applications la ON dr.loan_id = la.id
  `)
  return result.rows[0]
}

const getAuditLogs = async (limit = 50) => {
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(limit).lean()
  return logs.map((l) => ({
    id:         l._id,
    eventType:  l.event_type,
    entityType: l.entity_type,
    entityId:   l.entity_id,
    metadata:   l.metadata,
    timestamp:  l.timestamp,
  }))
}

module.exports = { getApplications, getStats, getAuditLogs }
