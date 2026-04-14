const { Pool } = require('pg')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

const connectPostgres = async () => {
  try {
    await pool.query('SELECT 1')
    console.log('PostgreSQL connected')
    await runMigrations()
  } catch (err) {
    console.error('PostgreSQL connection error:', err.message)
    process.exit(1)
  }
}

const runMigrations = async () => {
  const fs = require('fs')
  const path = require('path')
  const migrationsDir = path.join(__dirname, '../models/pg/migrations')

  const files = fs.readdirSync(migrationsDir).sort()
  for (const file of files) {
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8')
    await pool.query(sql)
  }
  console.log('PostgreSQL migrations applied')
}

module.exports = { pool, connectPostgres }
