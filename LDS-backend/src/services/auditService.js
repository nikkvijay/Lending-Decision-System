const AuditLog = require('../models/mongo/AuditLog')

const log = async ({ event_type, entity_type, entity_id, actor = 'system', metadata = {}, ip_address }) => {
  try {
    await AuditLog.create({ event_type, entity_type, entity_id, actor, metadata, ip_address })
  } catch (err) {
    // Audit failures must never break the main request flow
    console.error('Audit log failed:', err.message)
  }
}

module.exports = { log }
