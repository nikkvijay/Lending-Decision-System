const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/postgres')

const verifyPassword = (plaintext, stored) => {
  // stored format: pbkdf2:salt:hash
  const parts = stored.split(':')
  if (parts.length !== 3) return false
  const [, salt, hash] = parts
  const computed = crypto.pbkdf2Sync(plaintext, salt, 100_000, 64, 'sha512').toString('hex')
  return computed === hash
}

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Username and password are required' },
      })
    }

    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 AND is_active = TRUE',
      [username.trim().toLowerCase()]
    )

    const user = result.rows[0]

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid username or password' },
      })
    }

    // Update last login
    await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id])

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    )

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, username: user.username, email: user.email, role: user.role },
      },
    })
  } catch (err) {
    next(err)
  }
}

const getMe = async (req, res) => {
  res.json({ success: true, data: req.user })
}

module.exports = { login, getMe }
