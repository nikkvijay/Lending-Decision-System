-- Audit fields for business_profiles
ALTER TABLE business_profiles
  ADD COLUMN IF NOT EXISTS created_by VARCHAR(255) NOT NULL DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN      NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_profiles_is_deleted ON business_profiles(is_deleted);

-- Audit fields for loan_applications
ALTER TABLE loan_applications
  ADD COLUMN IF NOT EXISTS created_by VARCHAR(255) NOT NULL DEFAULT 'system',
  ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN      NOT NULL DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_loans_is_deleted ON loan_applications(is_deleted);
