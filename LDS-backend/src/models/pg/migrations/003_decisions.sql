CREATE TABLE IF NOT EXISTS decision_results (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loan_id       UUID         NOT NULL REFERENCES loan_applications(id) ON DELETE RESTRICT,
  job_id        VARCHAR(100) NOT NULL UNIQUE,
  status        VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
  decision      VARCHAR(10),
  credit_score  SMALLINT,
  reason_codes  TEXT[],
  processing_ms INTEGER,
  decided_at    TIMESTAMPTZ,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_decisions_loan_id ON decision_results(loan_id);
CREATE INDEX IF NOT EXISTS idx_decisions_job_id  ON decision_results(job_id);
