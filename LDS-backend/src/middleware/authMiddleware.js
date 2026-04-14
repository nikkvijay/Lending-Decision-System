const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
    })
  }

  const token = header.slice(7)
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired' },
    })
  }
}

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user?.role)) {
    return res.status(403).json({
      success: false,
      error: { code: 'FORBIDDEN', message: 'Insufficient permissions' },
    })
  }
  next()
}

module.exports = { authenticate, requireRole }
