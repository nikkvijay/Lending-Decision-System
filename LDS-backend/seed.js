/**
 * Seed Script — Admin & Super Admin users
 * Run: node seed.js
 *
 * Uses Node.js built-in crypto (no extra dependencies).
 * Password stored as: pbkdf2:salt:hash
 */

const crypto = require('crypto')
require('dotenv').config()
const { pool, connectPostgres } = require('./src/config/postgres')

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex')
  return `pbkdf2:${salt}:${hash}`
}

const USERS = [
  {
    username: 'admin',
    email:    'admin@lending-system.in',
    password: 'Admin@2025',
    role:     'admin',
  },
  {
    username: 'superadmin',
    email:    'superadmin@lending-system.in',
    password: 'SuperAdmin@2025',
    role:     'superadmin',
  },
]

const seed = async () => {
  await connectPostgres()

  console.log('\n Seeding users...\n')

  for (const user of USERS) {
    const hash = hashPassword(user.password)
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (username) DO UPDATE
         SET email         = EXCLUDED.email,
             password_hash = EXCLUDED.password_hash,
             role          = EXCLUDED.role,
             updated_at    = NOW()`,
      [user.username, user.email, hash, user.role]
    )
    console.log(` [${user.role.toUpperCase()}]`)
    console.log(`   Username : ${user.username}`)
    console.log(`   Email    : ${user.email}`)
    console.log(`   Password : ${user.password}`)
    console.log(`   Role     : ${user.role}\n`)
  }

  console.log(' Done — credentials above are stored in the users table.\n')
  await pool.end()
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
