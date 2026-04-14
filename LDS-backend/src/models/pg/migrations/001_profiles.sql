CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS business_profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_name      VARCHAR(255)  NOT NULL,
  pan             VARCHAR(10)   NOT NULL,
  pan_hash        VARCHAR(64)   NOT NULL UNIQUE,
  business_name   VARCHAR(255)  NOT NULL,
  business_type   VARCHAR(50)   NOT NULL,
  monthly_revenue NUMERIC(15,2) NOT NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_pan_hash ON business_profiles(pan_hash);
