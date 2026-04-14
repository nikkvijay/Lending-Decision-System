const express = require('express')
const router = express.Router()
const { getApplications, getStats, getAuditLogs } = require('../controllers/adminController')

router.get('/applications', getApplications)
router.get('/stats', getStats)
router.get('/audit-logs', getAuditLogs)

module.exports = router
