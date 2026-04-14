const adminService = require('../services/adminService')

const getApplications = async (req, res, next) => {
  try {
    const filter = ['ALL', 'APPROVED', 'REJECTED', 'PENDING'].includes(req.query.filter)
      ? req.query.filter
      : 'ALL'
    const data = await adminService.getApplications(filter)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

const getStats = async (req, res, next) => {
  try {
    const data = await adminService.getStats()
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

const getAuditLogs = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 200)
    const data = await adminService.getAuditLogs(limit)
    res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

module.exports = { getApplications, getStats, getAuditLogs }
