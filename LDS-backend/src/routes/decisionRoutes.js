const express = require('express')
const router = express.Router()
const { triggerDecision, getDecisionStatus } = require('../controllers/decisionController')
const { validateDecision } = require('../middleware/validateMiddleware')
const { decisionRateLimiter } = require('../middleware/rateLimiter')

router.post('/', decisionRateLimiter, validateDecision, triggerDecision)
router.get('/:jobId/status', getDecisionStatus)

module.exports = router
