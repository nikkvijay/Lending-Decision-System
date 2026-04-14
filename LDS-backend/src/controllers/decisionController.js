const { AppError } = require('../middleware/errorMiddleware')
const decisionService = require('../services/decisionService')

const triggerDecision = async (req, res, next) => {
  try {
    const { loanId } = req.body
    const result = await decisionService.triggerDecision(loanId)
    res.status(202).json({ success: true, data: result })
  } catch (err) {
    next(err)
  }
}

const getDecisionStatus = async (req, res, next) => {
  try {
    const { jobId } = req.params
    const status = await decisionService.getDecisionStatus(jobId)
    if (!status) throw new AppError('Decision not found', 404, 'DECISION_NOT_FOUND')
    res.status(200).json({ success: true, data: status })
  } catch (err) {
    next(err)
  }
}

module.exports = { triggerDecision, getDecisionStatus }
