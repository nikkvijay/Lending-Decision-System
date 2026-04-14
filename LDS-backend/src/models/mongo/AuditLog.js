const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema(
  {
    event_type: {
      type: String,
      required: true,
      enum: ['PROFILE_CREATED', 'LOAN_SUBMITTED', 'DECISION_STARTED', 'DECISION_COMPLETED', 'DECISION_FAILED'],
    },
    entity_type: { type: String, required: true },
    entity_id:   { type: String, required: true },
    actor:       { type: String, default: 'system' },
    metadata:    { type: mongoose.Schema.Types.Mixed, default: {} },
    ip_address:  { type: String },
    timestamp:   { type: Date, default: Date.now },
  },
  { timestamps: false }
)

auditLogSchema.index({ entity_id: 1 })
auditLogSchema.index({ event_type: 1, timestamp: -1 })
auditLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }) // 90 days TTL

module.exports = mongoose.model('AuditLog', auditLogSchema)
