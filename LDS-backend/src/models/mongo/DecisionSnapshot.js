const mongoose = require('mongoose')

const decisionSnapshotSchema = new mongoose.Schema(
  {
    decision_id: { type: String, required: true, unique: true },
    loan_id:     { type: String, required: true },
    profile_id:  { type: String, required: true },
    input_snapshot: {
      owner_name:      String,
      business_type:   String,
      monthly_revenue: Number,
      loan_amount:     Number,
      tenure_months:   Number,
      purpose:         String,
    },
    scoring_breakdown: {
      revenue_emi_ratio:   Number,
      revenue_emi_score:   Number,
      loan_multiple:       Number,
      loan_multiple_score: Number,
      tenure_score:        Number,
      business_type_score: Number,
      fraud_score:         Number,
      raw_score:           Number,
      final_score:         Number,
    },
    reason_codes:   [String],
    decision:       { type: String, enum: ['APPROVED', 'REJECTED'] },
    engine_version: { type: String, default: '1.0.0' },
    decided_at:     { type: Date },
  },
  { timestamps: true }
)

decisionSnapshotSchema.index({ loan_id: 1 })

module.exports = mongoose.model('DecisionSnapshot', decisionSnapshotSchema)
