CREATE TABLE IF NOT EXISTS loan_applications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id     UUID          NOT NULL REFERENCES business_profiles(id) ON DELETE RESTRICT,
  amount         NUMERIC(15,2) NOT NULL,
  tenure_months  SMALLINT      NOT NULL,
  purpose        VARCHAR(100)  NOT NULL,
  status         VARCHAR(20)   NOT NULL DEFAULT 'PENDING',
  created_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loans_profile_id ON loan_applications(profile_id);
CREATE INDEX IF NOT EXISTS idx_loans_status      ON loan_applications(status);
