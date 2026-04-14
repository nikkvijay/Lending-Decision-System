const { pool } = require('../config/postgres')
const { v4: uuidv4 } = require('uuid')
const runDecisionEngine = require('../engine')
const auditService = require('./auditService')
const DecisionSnapshot = require('../models/mongo/DecisionSnapshot')

const triggerDecision = async (loanId) => {
  const loanResult = await pool.query(
    `SELECT l.*, p.owner_name, p.business_type, p.monthly_revenue, p.id AS profile_id
     FROM loan_applications l
     JOIN business_profiles p ON l.profile_id = p.id
     WHERE l.id = $1`,
    [loanId]
  )

  if (!loanResult.rows[0]) {
    const err = new Error('Loan not found')
    err.statusCode = 404
    err.code = 'LOAN_NOT_FOUND'
    throw err
  }

  const loan = loanResult.rows[0]

  if (loan.status !== 'PENDING') {
    const err = new Error('A decision has already been triggered for this loan')
    err.statusCode = 409
    err.code = 'DECISION_ALREADY_EXISTS'
    throw err
  }

  const jobId = uuidv4()

  const decisionResult = await pool.query(
    `INSERT INTO decision_results (loan_id, job_id, status) VALUES ($1, $2, 'PENDING') RETURNING *`,
    [loanId, jobId]
  )
  const decision = decisionResult.rows[0]

  await auditService.log({
    event_type: 'DECISION_STARTED',
    entity_type: 'decision',
    entity_id: decision.id,
    metadata: { loanId },
  })

  // Trigger async processing (non-blocking)
  setImmediate(() => processDecision(loan, decision.id, jobId))

  return {
    jobId,
    decisionId: decision.id,
    status: 'PENDING',
    pollUrl: `/api/decisions/${jobId}/status`,
    estimatedWaitMs: 2000,
  }
}

const processDecision = async (loan, decisionId, jobId) => {
  const startTime = Date.now()

  try {
    await pool.query(`UPDATE decision_results SET status = 'PROCESSING' WHERE id = $1`, [decisionId])
    await pool.query(`UPDATE loan_applications SET status = 'PROCESSING' WHERE id = $1`, [loan.id])

    // Simulate realistic processing delay (800ms – 2500ms)
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1700))

    const engineInput = {
      ownerName:      loan.owner_name,
      businessType:   loan.business_type,
      monthlyRevenue: parseFloat(loan.monthly_revenue),
      loanAmount:     parseFloat(loan.amount),
      tenureMonths:   parseInt(loan.tenure_months),
      purpose:        loan.purpose,
    }

    const result = runDecisionEngine(engineInput)
    const processingMs = Date.now() - startTime

    await pool.query(
      `UPDATE decision_results
       SET status = 'COMPLETED', decision = $1, credit_score = $2,
           reason_codes = $3, processing_ms = $4, decided_at = NOW()
       WHERE id = $5`,
      [result.decision, result.creditScore, result.reasonCodes, processingMs, decisionId]
    )

    await pool.query(`UPDATE loan_applications SET status = 'COMPLETED' WHERE id = $1`, [loan.id])

    await DecisionSnapshot.create({
      decision_id:       decisionId,
      loan_id:           loan.id,
      profile_id:        loan.profile_id,
      input_snapshot:    engineInput,
      scoring_breakdown: result.scoringBreakdown,
      reason_codes:      result.reasonCodes,
      decision:          result.decision,
      decided_at:        new Date(),
    })

    await auditService.log({
      event_type: 'DECISION_COMPLETED',
      entity_type: 'decision',
      entity_id: decisionId,
      metadata: { decision: result.decision, creditScore: result.creditScore, processingMs },
    })
  } catch (err) {
    console.error('Decision processing failed:', err)
    await pool.query(`UPDATE decision_results SET status = 'FAILED' WHERE id = $1`, [decisionId])
    await pool.query(`UPDATE loan_applications SET status = 'FAILED' WHERE id = $1`, [loan.id])
    await auditService.log({
      event_type: 'DECISION_FAILED',
      entity_type: 'decision',
      entity_id: decisionId,
      metadata: { error: err.message },
    })
  }
}

const getDecisionStatus = async (jobId) => {
  const result = await pool.query('SELECT * FROM decision_results WHERE job_id = $1', [jobId])
  if (!result.rows[0]) return null
  const d = result.rows[0]
  return {
    jobId:        d.job_id,
    status:       d.status,
    decision:     d.decision || null,
    creditScore:  d.credit_score || null,
    reasonCodes:  d.reason_codes || [],
    decidedAt:    d.decided_at || null,
    loanId:       d.loan_id,
    processingMs: d.processing_ms || null,
  }
}

module.exports = { triggerDecision, getDecisionStatus }
