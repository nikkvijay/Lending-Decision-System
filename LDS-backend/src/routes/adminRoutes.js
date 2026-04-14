const express = require('express')
const router = express.Router()
const { getApplications, getStats, getAuditLogs } = require('../controllers/adminController')
const { authenticate, requireRole } = require('../middleware/authMiddleware')

// All admin routes require a valid token
router.use(authenticate)

// /applications and /stats — admin or superadmin
router.get('/applications', requireRole('admin', 'superadmin'), getApplications)
router.get('/stats',        requireRole('admin', 'superadmin'), getStats)

// /audit-logs — superadmin only
router.get('/audit-logs',   requireRole('superadmin'), getAuditLogs)

module.exports = router
